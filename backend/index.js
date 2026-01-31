const express = require("express");
const http = require("http");
const corsMiddleware = require("./utils/cors");
const rateLimitMiddleware = require("./utils/rateLimit");
const analyzeRoutes = require("./routes/analyze");
const sessionRoutes = require("./routes/session");
const WebSocketServer = require("./services/websocket");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize WebSocket server
const wsServer = new WebSocketServer(server);

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(rateLimitMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/session", sessionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(
    `🚀 PosturePal Multiplayer Backend running on http://localhost:${PORT}`,
  );
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket server ready on ws://localhost:${PORT}`);
  console.log(`\n🎮 Multiplayer Endpoints:`);
  console.log(`   POST /api/session/create - Create new session`);
  console.log(`   POST /api/session/join - Join existing session`);
  console.log(`   POST /api/session/start - Start competition`);
  console.log(`   GET  /api/session/:id - Get session info`);
  console.log(`   GET  /api/session/:id/leaderboard - Live leaderboard`);
});

module.exports = { app, server, wsServer };
