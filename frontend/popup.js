const SOCKET_URL = "http://localhost:3000";
let socket = null;
let currentSession = null;
let currentPlayer = null;

const pages = {
  mainMenu: document.getElementById("mainMenuPage"),
  duration: document.getElementById("durationPage"),
  join: document.getElementById("joinPage"),
  lobby: document.getElementById("lobbyPage"),
  session: document.getElementById("sessionPage"),
  leaderboard: document.getElementById("leaderboardPage"),
};

function showPage(pageName) {
  Object.values(pages).forEach((page) => page.classList.remove("active"));
  pages[pageName].classList.add("active");
}

function initSocket() {
  if (socket) return;

  socket = io(SOCKET_URL);

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("session_created", (data) => {
    console.log("Session created:", data);
    currentSession = data.sessionData;
    currentPlayer = data.player;

    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });

  socket.on("session_joined", (data) => {
    console.log("Joined session:", data);
    currentSession = data.sessionData;
    currentPlayer = data.player;

    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });

  socket.on("player_joined", (data) => {
    console.log("Player joined:", data);
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);
  });

  socket.on("player_left", (data) => {
    console.log("Player left:", data);
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);

    if (data.newHost && data.newHost.socketId === socket.id) {
      currentPlayer.isHost = true;
      showHostControls();
    }
  });

  socket.on("session_started", (data) => {
    console.log("Session started:", data);
    currentSession = data.sessionData;
    alert("Session started! (Active session page coming soon)");
  });

  socket.on("session_finished", (data) => {
    console.log("Session finished:", data);
    alert(
      `Session finished! Winner: ${data.winner.playerName} with ${data.winner.greenZoneTime}s in green zone`,
    );
  });

  socket.on("error", (data) => {
    console.error("Socket error:", data.message);
    alert(data.message);
  });
}

function updateLobbyUI(sessionData) {
  document.getElementById("playerCount").textContent = sessionData.playerCount;

  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";

  sessionData.players.forEach((player) => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";

    playerItem.innerHTML = `
      <span class="player-name">${player.playerName}${player.isHost ? " (Host)" : ""}</span>
      <span class="player-ready">${player.isReady ? "✓" : ""}</span>
    `;

    playersList.appendChild(playerItem);
  });

  if (currentPlayer && currentPlayer.isHost) {
    showHostControls();
  } else {
    hideHostControls();
  }
}

function showHostControls() {
  document.getElementById("startSessionBtn").style.display = "block";
  document.getElementById("waitingMessage").style.display = "none";
}

function hideHostControls() {
  document.getElementById("startSessionBtn").style.display = "none";
  document.getElementById("waitingMessage").style.display = "block";
}

// Main Menu
document.getElementById("createSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("duration");
});

document.getElementById("joinSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("join");
});

// Duration Selection
document.querySelectorAll(".duration-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const duration = parseInt(btn.dataset.duration);
    const minutes = duration / 60;

    document.getElementById("lobbyDuration").textContent = `${minutes} minutes`;

    socket.emit("create_session", { duration });
  });
});

document.getElementById("cancelDurationBtn").addEventListener("click", () => {
  showPage("mainMenu");
});

// Join Session Page
document.getElementById("joinConfirmBtn").addEventListener("click", () => {
  const sessionCode = document.getElementById("sessionCodeInput").value.trim();

  if (!sessionCode) {
    alert("Please enter a session code");
    return;
  }

  if (sessionCode.length !== 6) {
    alert("Session code must be 6 digits");
    return;
  }

  console.log("Joining session:", sessionCode);
  socket.emit("join_session", { sessionCode });

  // Clear input for next time
  document.getElementById("sessionCodeInput").value = "";
});

document.getElementById("cancelJoinBtn").addEventListener("click", () => {
  document.getElementById("sessionCodeInput").value = "";
  showPage("mainMenu");
});

// Auto-format session code input (numbers only)
document.getElementById("sessionCodeInput").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
});

// Lobby Actions
document.getElementById("copyLinkBtn").addEventListener("click", () => {
  const sessionCode = document.getElementById("lobbySessionCode").textContent;
  navigator.clipboard.writeText(sessionCode);

  const btn = document.getElementById("copyLinkBtn");
  const originalText = btn.textContent;
  btn.textContent = "[Copied!]";
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
});

document.getElementById("startSessionBtn").addEventListener("click", () => {
  if (currentSession) {
    socket.emit("start_session", { sessionCode: currentSession.sessionId });

    // Copy session code to active session page
    document.getElementById("activeSessionCode").textContent =
      currentSession.sessionId;

    // Navigate to active session page
    showPage("session");
    startPostureTracking();
  }
});

document.getElementById("leaveLobbyBtn").addEventListener("click", () => {
  if (currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
    currentSession = null;
    currentPlayer = null;
  }
  showPage("mainMenu");
});

// Active Session Page
document.getElementById("endSessionBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to end the session?")) {
    stopPostureTracking();
    if (currentSession) {
      socket.emit("leave_session", { sessionCode: currentSession.sessionId });
      currentSession = null;
      currentPlayer = null;
    }
    showPage("mainMenu");
  }
});

document.getElementById("rankStatBox").addEventListener("click", () => {
  // Copy session code to leaderboard page
  const sessionCode = document.getElementById("activeSessionCode").textContent;
  document.getElementById("leaderboardSessionCode").textContent = sessionCode;

  // Update leaderboard stats
  const yourRank = document.getElementById("rankValue").textContent;
  const yourScore = document.getElementById("scoreBadge").textContent;
  document.getElementById("yourRankLarge").textContent = yourRank;
  document.getElementById("yourScoreLarge").textContent = yourScore;

  showPage("leaderboard");
});

// Leaderboard Page
document.getElementById("backToSessionBtn").addEventListener("click", () => {
  showPage("session");
});

// Posture Tracking Functions
let trackingInterval = null;
let sessionTimeRemaining = 900; // 15 minutes in seconds
let skeletonCanvas = null;
let skeletonCtx = null;

function startPostureTracking() {
  console.log("🎮 Posture tracking started");

  // Initialize skeleton canvas
  initializeSkeletonCanvas();

  // Start camera (placeholder - will be replaced with actual camera access)
  initializeCameraFeed();

  // Start timer countdown
  trackingInterval = setInterval(() => {
    sessionTimeRemaining--;
    updateTimer();

    // Simulate posture updates (replace with real EyePop.ai integration)
    updatePostureScore();
    drawSkeletonModel();

    if (sessionTimeRemaining <= 0) {
      endSession();
    }
  }, 1000);
}

function stopPostureTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }

  // Stop camera feed
  const video = document.getElementById("cameraFeed");
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
  }

  console.log("🛑 Posture tracking stopped");
}

function initializeCameraFeed() {
  const video = document.getElementById("cameraFeed");

  // Request camera access (placeholder)
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log("Camera access denied or unavailable:", err);
      // Show placeholder instead
    });
}

function initializeSkeletonCanvas() {
  skeletonCanvas = document.getElementById("skeletonCanvas");
  skeletonCtx = skeletonCanvas.getContext("2d");

  // Set canvas size to match container
  const container = document.getElementById("cameraContainer");
  skeletonCanvas.width = container.offsetWidth;
  skeletonCanvas.height = container.offsetHeight;
}

function drawSkeletonModel() {
  if (!skeletonCtx) return;

  // Clear canvas
  skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

  // Simulate skeleton keypoints (replace with real EyePop.ai data)
  const centerX = skeletonCanvas.width / 2;
  const centerY = skeletonCanvas.height / 2;

  // Add slight movement for demo
  const time = Date.now() / 1000;
  const sway = Math.sin(time) * 5;

  // Define skeleton keypoints
  const skeleton = {
    nose: { x: centerX + sway, y: centerY - 80 },
    neck: { x: centerX + sway, y: centerY - 60 },
    leftShoulder: { x: centerX - 40 + sway, y: centerY - 55 },
    rightShoulder: { x: centerX + 40 + sway, y: centerY - 55 },
    leftElbow: { x: centerX - 50 + sway, y: centerY - 20 },
    rightElbow: { x: centerX + 50 + sway, y: centerY - 20 },
    leftWrist: { x: centerX - 55 + sway, y: centerY + 10 },
    rightWrist: { x: centerX + 55 + sway, y: centerY + 10 },
    leftHip: { x: centerX - 25, y: centerY + 20 },
    rightHip: { x: centerX + 25, y: centerY + 20 },
    leftKnee: { x: centerX - 30, y: centerY + 60 },
    rightKnee: { x: centerX + 30, y: centerY + 60 },
    leftAnkle: { x: centerX - 25, y: centerY + 95 },
    rightAnkle: { x: centerX + 25, y: centerY + 95 },
  };

  // Draw skeleton connections
  const connections = [
    ["nose", "neck"],
    ["neck", "leftShoulder"],
    ["neck", "rightShoulder"],
    ["leftShoulder", "leftElbow"],
    ["rightShoulder", "rightElbow"],
    ["leftElbow", "leftWrist"],
    ["rightElbow", "rightWrist"],
    ["neck", "leftHip"],
    ["neck", "rightHip"],
    ["leftHip", "leftKnee"],
    ["rightHip", "rightKnee"],
    ["leftKnee", "leftAnkle"],
    ["rightKnee", "rightAnkle"],
    ["leftHip", "rightHip"],
  ];

  // Get current score for color
  const score = parseInt(document.getElementById("scoreBadge").textContent);
  let color = "#4caf50"; // green
  if (score < 70 && score >= 40) color = "#ffc107"; // yellow
  if (score < 40) color = "#f44336"; // red

  // Draw connections
  skeletonCtx.strokeStyle = color;
  skeletonCtx.lineWidth = 3;
  skeletonCtx.shadowBlur = 10;
  skeletonCtx.shadowColor = color;

  connections.forEach(([start, end]) => {
    skeletonCtx.beginPath();
    skeletonCtx.moveTo(skeleton[start].x, skeleton[start].y);
    skeletonCtx.lineTo(skeleton[end].x, skeleton[end].y);
    skeletonCtx.stroke();
  });

  // Draw keypoints
  skeletonCtx.fillStyle = color;
  skeletonCtx.shadowBlur = 15;
  Object.values(skeleton).forEach((point) => {
    skeletonCtx.beginPath();
    skeletonCtx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    skeletonCtx.fill();
  });
}

function updateTimer() {
  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;
  document.getElementById("timeRemaining").textContent =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updatePostureScore() {
  // Simulate score fluctuation (replace with real EyePop.ai data)
  const currentScore = parseInt(
    document.getElementById("scoreBadge").textContent,
  );
  const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const newScore = Math.max(0, Math.min(100, currentScore + change));

  document.getElementById("scoreBadge").textContent = newScore;

  // Update container color based on score
  const container = document.getElementById("cameraContainer");
  const status = document.getElementById("postureStatus");

  container.classList.remove("warning", "danger");
  status.classList.remove("warning", "danger");

  if (newScore >= 70) {
    status.querySelector(".status-text").textContent = "Good Posture";
    status.querySelector(".status-icon").textContent = "✓";
  } else if (newScore >= 40) {
    container.classList.add("warning");
    status.classList.add("warning");
    status.querySelector(".status-text").textContent = "Need Adjustment";
    status.querySelector(".status-icon").textContent = "⚠";
  } else {
    container.classList.add("danger");
    status.classList.add("danger");
    status.querySelector(".status-text").textContent = "Poor Posture";
    status.querySelector(".status-icon").textContent = "✗";
  }
}

function endSession() {
  stopPostureTracking();
  alert("🎉 Session Complete!\n\nGreat job maintaining your posture!");
  showPage("mainMenu");
}

// Cleanup on close
window.addEventListener("beforeunload", () => {
  if (socket && currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
  }
});
