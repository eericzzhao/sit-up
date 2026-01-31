const { v4: uuidv4 } = require("uuid");

class SessionManager {
  constructor() {
    this.sessions = new Map(); // sessionId -> session object
    this.userSessions = new Map(); // userId -> sessionId
  }

  // Create a new competitive session
  createSession(hostUserId, hostUsername, duration = 15) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      hostId: hostUserId,
      duration: duration * 60 * 1000, // Convert to milliseconds
      startTime: null,
      endTime: null,
      status: "waiting", // waiting, active, completed
      players: new Map(),
      createdAt: Date.now(),
    };

    // Add host as first player
    this.addPlayerToSession(sessionId, hostUserId, hostUsername);
    this.sessions.set(sessionId, session);

    console.log(`✨ Session ${sessionId} created by ${hostUsername}`);
    return session;
  }

  // Join existing session
  joinSession(sessionId, userId, username) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status === "completed") {
      throw new Error("Session has already ended");
    }

    if (session.status === "active") {
      throw new Error("Session has already started");
    }

    if (session.players.size >= 10) {
      throw new Error("Session is full (max 10 players)");
    }

    this.addPlayerToSession(sessionId, userId, username);

    console.log(`👥 ${username} joined session ${sessionId}`);
    return session;
  }

  // Add player to session
  addPlayerToSession(sessionId, userId, username) {
    const session = this.sessions.get(sessionId);

    session.players.set(userId, {
      id: userId,
      username: username,
      score: 0,
      goodPostureTime: 0, // milliseconds in good posture
      badPostureTime: 0, // milliseconds in bad posture
      lastUpdateTime: Date.now(),
      connected: true,
      isHost: userId === session.hostId,
    });

    this.userSessions.set(userId, sessionId);
  }

  // Start session
  startSession(sessionId, hostUserId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.hostId !== hostUserId) {
      throw new Error("Only the host can start the session");
    }

    if (session.status !== "waiting") {
      throw new Error("Session already started");
    }

    if (session.players.size < 2) {
      throw new Error("Need at least 2 players to start");
    }

    session.status = "active";
    session.startTime = Date.now();
    session.endTime = session.startTime + session.duration;

    console.log(
      `🎮 Session ${sessionId} started with ${session.players.size} players`,
    );

    // Auto-end session after duration
    setTimeout(() => {
      this.endSession(sessionId);
    }, session.duration);

    return session;
  }

  // Update player posture score
  updatePlayerPosture(sessionId, userId, postureData) {
    const session = this.sessions.get(sessionId);

    if (!session || session.status !== "active") {
      return null;
    }

    const player = session.players.get(userId);
    if (!player) {
      return null;
    }

    const now = Date.now();
    const timeDelta = now - player.lastUpdateTime;

    // Posture scoring logic
    const { score: currentScore, isGoodPosture } = postureData;

    if (isGoodPosture) {
      // Good posture: gain points
      player.score += Math.floor(timeDelta / 1000) * 2; // 2 points per second
      player.goodPostureTime += timeDelta;
    } else {
      // Bad posture: lose points
      player.score = Math.max(
        0,
        player.score - Math.floor(timeDelta / 1000) * 3,
      ); // Lose 3 points per second
      player.badPostureTime += timeDelta;
    }

    player.lastUpdateTime = now;

    return {
      userId,
      score: player.score,
      goodPostureTime: player.goodPostureTime,
      badPostureTime: player.badPostureTime,
    };
  }

  // End session
  endSession(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session || session.status === "completed") {
      return null;
    }

    session.status = "completed";
    session.endTime = Date.now();

    // Calculate final rankings
    const rankings = Array.from(session.players.values())
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        userId: player.id,
        username: player.username,
        score: player.score,
        goodPostureTime: player.goodPostureTime,
        badPostureTime: player.badPostureTime,
        accuracy:
          (player.goodPostureTime /
            (player.goodPostureTime + player.badPostureTime)) *
            100 || 0,
      }));

    console.log(`🏁 Session ${sessionId} completed`);

    // Clean up user sessions
    session.players.forEach((player, userId) => {
      this.userSessions.delete(userId);
    });

    return {
      sessionId,
      rankings,
      duration: session.endTime - session.startTime,
      completedAt: session.endTime,
    };
  }

  // Get session info
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  // Get session by user
  getSessionByUser(userId) {
    const sessionId = this.userSessions.get(userId);
    return sessionId ? this.sessions.get(sessionId) : null;
  }

  // Leave session
  leaveSession(sessionId, userId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    session.players.delete(userId);
    this.userSessions.delete(userId);

    // If host leaves, end session
    if (userId === session.hostId) {
      return this.endSession(sessionId);
    }

    // If no players left, delete session
    if (session.players.size === 0) {
      this.sessions.delete(sessionId);
    }

    return session;
  }

  // Get leaderboard for session
  getLeaderboard(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    return Array.from(session.players.values())
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        rank: index + 1,
        userId: player.id,
        username: player.username,
        score: player.score,
        connected: player.connected,
      }));
  }

  // Cleanup old sessions (waiting > 1 hour, completed > 24 hours)
  cleanupSessions() {
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_DAY = 24 * 60 * 60 * 1000;

    this.sessions.forEach((session, sessionId) => {
      if (session.status === "waiting" && now - session.createdAt > ONE_HOUR) {
        console.log(`🧹 Cleaning up abandoned session ${sessionId}`);
        this.sessions.delete(sessionId);
      } else if (
        session.status === "completed" &&
        now - session.endTime > ONE_DAY
      ) {
        console.log(`🧹 Cleaning up old completed session ${sessionId}`);
        this.sessions.delete(sessionId);
      }
    });
  }
}

// Singleton instance
const sessionManager = new SessionManager();

// Cleanup every 10 minutes
setInterval(
  () => {
    sessionManager.cleanupSessions();
  },
  10 * 60 * 1000,
);

module.exports = sessionManager;
