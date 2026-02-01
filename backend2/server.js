import "dotenv/config";                          // ← loads .env into process.env
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { EyePop } from "@eyepop.ai/eyepop";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*" }));

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ---------------------------------------------------------------------------
// EyePop session endpoint
// ---------------------------------------------------------------------------
// EyePop.workerEndpoint() with no arguments reads EYEPOP_SECRET_KEY and
// EYEPOP_POP_ID from process.env automatically.  dotenv above makes sure
// those are populated from your .env file.
app.get("/eyepop/session", async (req, res) => {
  try {
    const endpoint = await EyePop.workerEndpoint().connect();
    const session  = await endpoint.session();
    await endpoint.disconnect();
    res.json(session);
  } catch (err) {
    console.error("eyepop/session error:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// ---------------------------------------------------------------------------
// In-memory session store
// ---------------------------------------------------------------------------
const sessions = new Map();

function generateCode() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function findSessionBySocket(socketId) {
  for (const [code, session] of sessions) {
    if (session.players.some((p) => p.socketId === socketId)) {
      return { code, session };
    }
  }
  return null;
}

function sessionToPayload(session, code) {
  return {
    sessionId: code,
    duration: session.duration,
    players: session.players.map((p) => ({
      playerName: p.playerName,
      isHost: p.isHost,
      isReady: p.isReady,
      score: p.score,
      greenZoneTime: p.greenZoneTime,
    })),
    playerCount: session.players.length,
    started: session.started,
  };
}

// ---------------------------------------------------------------------------
// Socket.IO events
// ---------------------------------------------------------------------------
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // --- CREATE SESSION ---
  socket.on("create_session", (data) => {
    const duration = data?.duration || 600;
    const code = generateCode();

    const player = {
      socketId: socket.id,
      playerName: `Player_${code.slice(-3)}`,
      isHost: true,
      isReady: true,
      score: 0,
      greenZoneTime: 0,
    };

    const session = {
      sessionId: code,
      duration,
      players: [player],
      started: false,
      startedAt: null,
      timer: null,
    };

    sessions.set(code, session);
    socket.join(code);

    socket.emit("session_created", {
      sessionCode: code,
      sessionData: sessionToPayload(session, code),
      player: { ...player, socketId: undefined },
    });

    console.log(`Session ${code} created by ${socket.id}`);
  });

  // --- JOIN SESSION ---
  socket.on("join_session", (data) => {
    const code = data?.sessionCode;
    const session = sessions.get(code);

    if (!session) {
      socket.emit("error", { message: "Session not found. Check the code." });
      return;
    }
    if (session.started) {
      socket.emit("error", { message: "Session has already started." });
      return;
    }
    if (session.players.length >= 4) {
      socket.emit("error", { message: "Session is full (max 4 players)." });
      return;
    }

    const player = {
      socketId: socket.id,
      playerName: `Player_${socket.id.slice(-4)}`,
      isHost: false,
      isReady: true,
      score: 0,
      greenZoneTime: 0,
    };

    session.players.push(player);
    socket.join(code);

    socket.emit("session_joined", {
      sessionCode: code,
      sessionData: sessionToPayload(session, code),
      player: { ...player, socketId: undefined },
    });

    socket.to(code).emit("player_joined", {
      sessionData: sessionToPayload(session, code),
    });

    console.log(`${socket.id} joined session ${code}`);
  });

  // --- START SESSION (host only) ---
  socket.on("start_session", (data) => {
    const code = data?.sessionCode;
    const session = sessions.get(code);

    if (!session) {
      socket.emit("error", { message: "Session not found." });
      return;
    }

    const host = session.players.find((p) => p.socketId === socket.id);
    if (!host?.isHost) {
      socket.emit("error", { message: "Only the host can start the session." });
      return;
    }

    if (session.started) {
      // Already started — ignore duplicate
      return;
    }

    session.started = true;
    session.startedAt = Date.now();

    // Notify ALL clients (including the host) via the room broadcast.
    // The host's popup.js uses this event — not the button click — as the
    // single trigger for startPostureTracking().
    io.to(code).emit("session_started", {
      sessionData: sessionToPayload(session, code),
    });

    // Server-side countdown
    let remaining = session.duration;
    session.timer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(session.timer);
        session.timer = null;

        const sorted = [...session.players].sort(
          (a, b) => b.greenZoneTime - a.greenZoneTime
        );
        const winner = sorted[0] || { playerName: "Nobody", greenZoneTime: 0 };

        io.to(code).emit("session_finished", {
          winner: {
            playerName: winner.playerName,
            greenZoneTime: winner.greenZoneTime,
            score: winner.score,
          },
          finalLeaderboard: sorted.map((p) => ({
            playerName: p.playerName,
            score: p.score,
            greenZoneTime: p.greenZoneTime,
          })),
        });

        setTimeout(() => sessions.delete(code), 5000);
        console.log(`Session ${code} finished. Winner: ${winner.playerName}`);
      }
    }, 1000);

    console.log(`Session ${code} started. Duration: ${session.duration}s`);
  });

  // --- SCORE UPDATE ---
  socket.on("update_score", (data) => {
    const { sessionCode, score, greenZoneTime } = data || {};
    const session = sessions.get(sessionCode);
    if (!session) return;

    const player = session.players.find((p) => p.socketId === socket.id);
    if (!player) return;

    player.score = score ?? player.score;
    player.greenZoneTime = greenZoneTime ?? player.greenZoneTime;

    const leaderboard = [...session.players]
      .sort((a, b) => b.greenZoneTime - a.greenZoneTime)
      .map((p, i) => ({
        rank: i + 1,
        playerName: p.playerName,
        score: p.score,
        greenZoneTime: p.greenZoneTime,
      }));

    io.to(sessionCode).emit("leaderboard_update", { leaderboard });
  });

  // --- LEAVE SESSION ---
  socket.on("leave_session", (data) => {
    const code = data?.sessionCode;
    const session = sessions.get(code);
    if (!session) return;

    session.players = session.players.filter((p) => p.socketId !== socket.id);
    socket.leave(code);

    if (session.players.length === 0) {
      if (session.timer) clearInterval(session.timer);
      sessions.delete(code);
      console.log(`Session ${code} deleted (empty).`);
      return;
    }

    let newHost = null;
    if (!session.players.some((p) => p.isHost)) {
      session.players[0].isHost = true;
      newHost = {
        playerName: session.players[0].playerName,
        socketId: session.players[0].socketId,
      };
    }

    io.to(code).emit("player_left", {
      sessionData: sessionToPayload(session, code),
      newHost,
    });

    console.log(`Socket ${socket.id} left session ${code}`);
  });

  // --- DISCONNECT ---
  socket.on("disconnect", () => {
    const found = findSessionBySocket(socket.id);
    if (found) {
      const { code, session } = found;
      session.players = session.players.filter((p) => p.socketId !== socket.id);
      socket.leave(code);

      if (session.players.length === 0) {
        if (session.timer) clearInterval(session.timer);
        sessions.delete(code);
      } else {
        if (!session.players.some((p) => p.isHost)) {
          session.players[0].isHost = true;
        }
        io.to(code).emit("player_left", {
          sessionData: sessionToPayload(session, code),
          newHost: session.players[0]
            ? { playerName: session.players[0].playerName, socketId: session.players[0].socketId }
            : null,
        });
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = 3000;
httpServer.listen(PORT, () => console.log(`server on ${PORT}`));