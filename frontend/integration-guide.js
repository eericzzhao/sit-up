/**
 * PosturePal Chrome Extension - WebSocket Integration Guide
 *
 * This guide shows how to connect your Chrome extension to the multiplayer backend
 */

// ============================================
// 1. SETUP & CONNECTION
// ============================================

class PosturePalClient {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.sessionId = null;
    this.isConnected = false;
  }

  // Connect to WebSocket server
  connect(serverUrl = "ws://localhost:3000") {
    this.ws = new WebSocket(serverUrl);

    this.ws.onopen = () => {
      console.log("✅ Connected to PosturePal server");
      this.isConnected = true;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("🔌 Disconnected from server");
      this.isConnected = false;
      // Implement reconnection logic here
    };
  }

  // Handle incoming messages
  handleMessage(message) {
    const { type, payload } = message;

    switch (type) {
      case "registered":
        console.log("Registered to session:", payload.sessionId);
        this.updateUI("registered", payload);
        break;

      case "posture_feedback":
        console.log("Posture score:", payload.score);
        this.updatePostureFeedback(payload);
        break;

      case "leaderboard_update":
        console.log("Leaderboard updated");
        this.updateLeaderboard(payload.leaderboard);
        break;

      case "player_joined":
        console.log("New player joined:", payload.userId);
        this.updatePlayerList(payload.players);
        break;

      case "player_disconnected":
        console.log("Player left:", payload.userId);
        this.removePlayer(payload.userId);
        break;

      case "error":
        console.error("Server error:", payload.error);
        this.showError(payload.error);
        break;
    }
  }

  // Send message to server
  send(type, payload) {
    if (!this.isConnected) {
      console.error("Not connected to server");
      return;
    }

    this.ws.send(JSON.stringify({ type, payload }));
  }

  // Register to session
  registerToSession(userId, sessionId) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.send("register", { userId, sessionId });
  }

  // Send posture update
  sendPostureUpdate(imageData) {
    this.send("posture_update", {
      sessionId: this.sessionId,
      userId: this.userId,
      imageData: imageData, // base64 encoded
    });
  }

  // Request leaderboard
  requestLeaderboard() {
    this.send("session_update", {
      sessionId: this.sessionId,
      action: "request_leaderboard",
    });
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// ============================================
// 2. SESSION MANAGEMENT (HTTP API)
// ============================================

const API_BASE = "http://localhost:3000/api";

// Create a new session
// Duration options: 1, 15, 30, 45, 60 (recommended intervals)
// For 60+ minutes, use any value up to 480 (8 hours max)
async function createSession(userId, username, duration = 15) {
  const response = await fetch(`${API_BASE}/session/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, username, duration }),
  });
  return await response.json();
}

// Join existing session
async function joinSession(sessionId, userId, username) {
  const response = await fetch(`${API_BASE}/session/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, userId, username }),
  });
  return await response.json();
}

// Start session (host only)
async function startSession(sessionId, userId) {
  const response = await fetch(`${API_BASE}/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, userId }),
  });
  return await response.json();
}

// Get session info
async function getSessionInfo(sessionId) {
  const response = await fetch(`${API_BASE}/session/${sessionId}`);
  return await response.json();
}

// Get leaderboard
async function getLeaderboard(sessionId) {
  const response = await fetch(`${API_BASE}/session/${sessionId}/leaderboard`);
  return await response.json();
}

// Leave session
async function leaveSession(sessionId, userId) {
  const response = await fetch(`${API_BASE}/session/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, userId }),
  });
  return await response.json();
}

// ============================================
// 3. COMPLETE MULTIPLAYER FLOW EXAMPLE
// ============================================

async function multiplayerFlow() {
  const client = new PosturePalClient();
  const userId = "user_" + Math.random().toString(36).substr(2, 9);
  const username = "Player1";

  // Step 1: Create session
  const createResult = await createSession(userId, username, 15);
  const sessionId = createResult.sessionId;
  console.log("Session created:", sessionId);

  // Step 2: Connect WebSocket
  client.connect();
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for connection

  // Step 3: Register to session
  client.registerToSession(userId, sessionId);

  // Step 4: Other players join (via share link)
  // Friend uses: await joinSession(sessionId, friendUserId, friendUsername);

  // Step 5: Host starts session
  await startSession(sessionId, userId);
  console.log("Session started!");

  // Step 6: Capture webcam and send frames
  const videoElement = document.querySelector("video");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Send posture updates every 2 seconds
  setInterval(() => {
    // Capture frame from video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    // Convert to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    // Send to server
    client.sendPostureUpdate(imageData);
  }, 2000);

  // Step 7: Update UI based on server responses
  // (handled in client.handleMessage)
}

// ============================================
// 4. UI UPDATE FUNCTIONS (implement these)
// ============================================

function updateUI(event, data) {
  // Update your extension popup UI
  console.log("UI Update:", event, data);
}

function updatePostureFeedback(feedback) {
  // Show user their current posture score
  // feedback.score, feedback.isGoodPosture, etc.
  document.getElementById("score").textContent = feedback.currentScore;
  document.getElementById("posture-status").textContent = feedback.isGoodPosture
    ? "✅ Good!"
    : "⚠️ Fix posture";
}

function updateLeaderboard(leaderboard) {
  // Update leaderboard display
  const leaderboardEl = document.getElementById("leaderboard");
  leaderboardEl.innerHTML = leaderboard
    .map(
      (player) => `
    <div class="player">
      <span class="rank">#${player.rank}</span>
      <span class="name">${player.username}</span>
      <span class="score">${player.score} pts</span>
    </div>
  `,
    )
    .join("");
}

function updatePlayerList(players) {
  // Update list of connected players
  const playersEl = document.getElementById("players");
  playersEl.innerHTML = players
    .map(
      (p) => `
    <div class="player ${p.connected ? "online" : "offline"}">
      ${p.username} ${p.isHost ? "👑" : ""}
    </div>
  `,
    )
    .join("");
}

function removePlayer(userId) {
  // Remove player from UI
  const playerEl = document.querySelector(`[data-user-id="${userId}"]`);
  if (playerEl) playerEl.remove();
}

function showError(error) {
  // Show error message
  alert("Error: " + error);
}

// ============================================
// 5. CHROME EXTENSION INTEGRATION
// ============================================

// In your popup.js or content script:

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createSession") {
    createSession(request.userId, request.username).then((result) =>
      sendResponse(result),
    );
    return true; // Keep channel open
  }

  if (request.action === "joinSession") {
    joinSession(request.sessionId, request.userId, request.username).then(
      (result) => sendResponse(result),
    );
    return true;
  }
});

// ============================================
// 6. WEBCAM CAPTURE IN CHROME EXTENSION
// ============================================

async function setupWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    return video;
  } catch (error) {
    console.error("Webcam access denied:", error);
    return null;
  }
}

// Capture frame from video
function captureFrame(video) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // Convert to base64 JPEG
  return canvas.toDataURL("image/jpeg", 0.8);
}

// ============================================
// EXPORT FOR USE
// ============================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PosturePalClient,
    createSession,
    joinSession,
    startSession,
    getSessionInfo,
    getLeaderboard,
    leaveSession,
  };
}
