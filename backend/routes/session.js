const express = require("express");
const router = express.Router();
const sessionManager = require("../services/sessionManager");

// Create a new session
router.post("/create", (req, res) => {
  try {
    const { userId, username, duration = 15 } = req.body;

    if (!userId || !username) {
      return res
        .status(400)
        .json({ error: "userId and username are required" });
    }

    // Validate duration
    if (typeof duration !== "number" || duration < 1) {
      return res
        .status(400)
        .json({ error: "Duration must be a positive number (in minutes)" });
    }

    // Maximum duration: 8 hours (480 minutes)
    if (duration > 480) {
      return res
        .status(400)
        .json({ error: "Maximum duration is 8 hours (480 minutes)" });
    }

    // Check if user already in a session
    const existingSession = sessionManager.getSessionByUser(userId);
    if (existingSession) {
      return res.status(400).json({
        error: "Already in a session",
        sessionId: existingSession.id,
      });
    }

    const session = sessionManager.createSession(userId, username, duration);

    res.json({
      success: true,
      sessionId: session.id,
      message: "Session created successfully",
      session: {
        id: session.id,
        status: session.status,
        duration: session.duration,
        players: Array.from(session.players.values()).map((p) => ({
          id: p.id,
          username: p.username,
          isHost: p.isHost,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join existing session
router.post("/join", (req, res) => {
  try {
    const { sessionId, userId, username } = req.body;

    if (!sessionId || !userId || !username) {
      return res
        .status(400)
        .json({ error: "sessionId, userId, and username are required" });
    }

    const session = sessionManager.joinSession(sessionId, userId, username);

    res.json({
      success: true,
      message: "Joined session successfully",
      session: {
        id: session.id,
        status: session.status,
        duration: session.duration,
        players: Array.from(session.players.values()).map((p) => ({
          id: p.id,
          username: p.username,
          isHost: p.isHost,
        })),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start session (host only)
router.post("/start", (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res
        .status(400)
        .json({ error: "sessionId and userId are required" });
    }

    const session = sessionManager.startSession(sessionId, userId);

    res.json({
      success: true,
      message: "Session started",
      session: {
        id: session.id,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        players: Array.from(session.players.values()).map((p) => ({
          id: p.id,
          username: p.username,
          score: p.score,
        })),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get session info
router.get("/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      success: true,
      session: {
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
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get("/:sessionId/leaderboard", (req, res) => {
  try {
    const { sessionId } = req.params;
    const leaderboard = sessionManager.getLeaderboard(sessionId);

    if (!leaderboard) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave session
router.post("/leave", (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res
        .status(400)
        .json({ error: "sessionId and userId are required" });
    }

    const result = sessionManager.leaveSession(sessionId, userId);

    res.json({
      success: true,
      message: "Left session successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
