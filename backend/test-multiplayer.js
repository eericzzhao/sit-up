// Test script for multiplayer session flow
// Run this to test the backend without the frontend

const WebSocket = require("ws");

const BASE_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3000";

// Simulate two players
const player1 = { userId: "player1", username: "Alice" };
const player2 = { userId: "player2", username: "Bob" };

let sessionId = null;

async function testMultiplayerFlow() {
  console.log("🎮 Testing PosturePal Multiplayer Backend\n");

  try {
    // 1. Create session
    console.log("1️⃣ Alice creates a session...");
    const createResponse = await fetch(`${BASE_URL}/api/session/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: player1.userId,
        username: player1.username,
        duration: 1, // 1 minute for testing
      }),
    });
    const createData = await createResponse.json();
    sessionId = createData.sessionId;
    console.log(`✅ Session created: ${sessionId}\n`);

    // 2. Bob joins
    console.log("2️⃣ Bob joins the session...");
    const joinResponse = await fetch(`${BASE_URL}/api/session/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        userId: player2.userId,
        username: player2.username,
      }),
    });
    const joinData = await joinResponse.json();
    console.log(
      `✅ Bob joined! Players: ${joinData.session.players.map((p) => p.username).join(", ")}\n`,
    );

    // 3. Connect WebSockets
    console.log("3️⃣ Connecting WebSockets...");
    const ws1 = new WebSocket(WS_URL);
    const ws2 = new WebSocket(WS_URL);

    await Promise.all([
      new Promise((resolve) => ws1.on("open", resolve)),
      new Promise((resolve) => ws2.on("open", resolve)),
    ]);

    // Register both players
    ws1.send(
      JSON.stringify({
        type: "register",
        payload: { userId: player1.userId, sessionId },
      }),
    );

    ws2.send(
      JSON.stringify({
        type: "register",
        payload: { userId: player2.userId, sessionId },
      }),
    );

    // Listen for messages
    ws1.on("message", (data) => {
      const msg = JSON.parse(data);
      console.log(`📨 Alice received: ${msg.type}`);
      if (msg.type === "leaderboard_update") {
        console.log(
          "   Leaderboard:",
          msg.payload.leaderboard
            .map((p) => `${p.rank}. ${p.username}: ${p.score}pts`)
            .join(", "),
        );
      }
    });

    ws2.on("message", (data) => {
      const msg = JSON.parse(data);
      console.log(`📨 Bob received: ${msg.type}`);
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("✅ WebSockets connected\n");

    // 4. Start session
    console.log("4️⃣ Alice starts the session...");
    const startResponse = await fetch(`${BASE_URL}/api/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        userId: player1.userId,
      }),
    });
    const startData = await startResponse.json();
    console.log(
      `✅ Session started! Ends at: ${new Date(startData.session.endTime).toLocaleTimeString()}\n`,
    );

    // 5. Simulate posture updates (without actual images for testing)
    console.log("5️⃣ Simulating posture competition...");
    console.log("   (In real usage, send webcam frames via WebSocket)\n");

    // 6. Get leaderboard
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("6️⃣ Fetching current leaderboard...");
    const leaderboardResponse = await fetch(
      `${BASE_URL}/api/session/${sessionId}/leaderboard`,
    );
    const leaderboardData = await leaderboardResponse.json();
    console.log("🏆 Current Standings:");
    leaderboardData.leaderboard.forEach((player) => {
      console.log(
        `   ${player.rank}. ${player.username}: ${player.score} points`,
      );
    });

    console.log("\n✨ Test complete! Session will auto-end in 1 minute.");
    console.log(
      "💡 Connect your Chrome extension to start real posture tracking!\n",
    );

    // Keep connections open
    setTimeout(() => {
      ws1.close();
      ws2.close();
      console.log("👋 Test ended");
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Run test
console.log("⏳ Make sure the server is running (npm start)\n");
setTimeout(() => testMultiplayerFlow(), 1000);
