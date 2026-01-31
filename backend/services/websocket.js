const WebSocket = require("ws");
const sessionManager = require("./sessionManager");
const eyePopService = require("./eyepop");
const { analyzePosture } = require("./normalize");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // userId -> ws connection

    this.wss.on("connection", (ws) => {
      console.log("👋 New WebSocket connection");

      ws.on("message", (message) => {
        this.handleMessage(ws, message);
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });

    console.log("🔌 WebSocket server initialized");
  }

  async handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      const { type, payload } = data;

      switch (type) {
        case "register":
          this.handleRegister(ws, payload);
          break;

        case "posture_update":
          await this.handlePostureUpdate(ws, payload);
          break;

        case "session_update":
          this.handleSessionUpdate(ws, payload);
          break;

        default:
          console.warn("Unknown message type:", type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      this.sendError(ws, error.message);
    }
  }

  handleRegister(ws, payload) {
    const { userId, sessionId } = payload;

    if (!userId || !sessionId) {
      return this.sendError(ws, "userId and sessionId required");
    }

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return this.sendError(ws, "Session not found");
    }

    // Register client
    ws.userId = userId;
    ws.sessionId = sessionId;
    this.clients.set(userId, ws);

    console.log(`✅ User ${userId} registered for session ${sessionId}`);

    // Send confirmation
    this.sendToClient(ws, {
      type: "registered",
      payload: {
        userId,
        sessionId,
        session: this.serializeSession(session),
      },
    });

    // Notify other players
    this.broadcastToSession(
      sessionId,
      {
        type: "player_joined",
        payload: {
          userId,
          players: Array.from(session.players.values()).map((p) => ({
            id: p.id,
            username: p.username,
            connected: p.connected,
          })),
        },
      },
      userId,
    );
  }

  async handlePostureUpdate(ws, payload) {
    const { sessionId, userId, imageData } = payload;

    if (!sessionId || !userId || !imageData) {
      return this.sendError(ws, "Missing required fields");
    }

    try {
      // Analyze posture using EyePop
      const postureAnalysis = await analyzePosture(imageData);

      // Update player score in session
      const updateResult = sessionManager.updatePlayerPosture(
        sessionId,
        userId,
        postureAnalysis,
      );

      if (!updateResult) {
        return this.sendError(ws, "Failed to update posture");
      }

      // Send feedback to user
      this.sendToClient(ws, {
        type: "posture_feedback",
        payload: {
          ...postureAnalysis,
          score: updateResult.score,
        },
      });

      // Broadcast leaderboard update to all players in session
      const leaderboard = sessionManager.getLeaderboard(sessionId);
      this.broadcastToSession(sessionId, {
        type: "leaderboard_update",
        payload: { leaderboard },
      });
    } catch (error) {
      console.error("Posture analysis error:", error);
      this.sendError(ws, "Failed to analyze posture");
    }
  }

  handleSessionUpdate(ws, payload) {
    const { sessionId, action } = payload;

    if (action === "request_leaderboard") {
      const leaderboard = sessionManager.getLeaderboard(sessionId);
      this.sendToClient(ws, {
        type: "leaderboard_update",
        payload: { leaderboard },
      });
    }
  }

  handleDisconnect(ws) {
    if (ws.userId) {
      console.log(`👋 User ${ws.userId} disconnected`);
      this.clients.delete(ws.userId);

      // Update player status
      if (ws.sessionId) {
        const session = sessionManager.getSession(ws.sessionId);
        if (session && session.players.has(ws.userId)) {
          session.players.get(ws.userId).connected = false;

          // Notify other players
          this.broadcastToSession(
            ws.sessionId,
            {
              type: "player_disconnected",
              payload: { userId: ws.userId },
            },
            ws.userId,
          );
        }
      }
    }
  }

  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  sendError(ws, errorMessage) {
    this.sendToClient(ws, {
      type: "error",
      payload: { error: errorMessage },
    });
  }

  broadcastToSession(sessionId, message, excludeUserId = null) {
    const session = sessionManager.getSession(sessionId);
    if (!session) return;

    session.players.forEach((player) => {
      if (player.id !== excludeUserId) {
        const ws = this.clients.get(player.id);
        if (ws) {
          this.sendToClient(ws, message);
        }
      }
    });
  }

  serializeSession(session) {
    return {
      id: session.id,
      status: session.status,
      duration: session.duration,
      startTime: session.startTime,
      endTime: session.endTime,
      players: Array.from(session.players.values()).map((p) => ({
        id: p.id,
        username: p.username,
        score: p.score,
        isHost: p.isHost,
        connected: p.connected,
      })),
    };
  }
}

module.exports = WebSocketServer;
