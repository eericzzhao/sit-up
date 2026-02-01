const SOCKET_URL = "http://localhost:3000";
let socket = null;
let currentSession = null;
let currentPlayer = null;
let playerName = ""; // Store player name
let selectedDuration = null; // Store selected duration
let sessionCodeToJoin = null; // Store session code when joining

const pages = {
  mainMenu: document.getElementById("mainMenuPage"),
  duration: document.getElementById("durationPage"),
  nameEntry: document.getElementById("nameEntryPage"),
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

    // Set timer to match session duration
    sessionTimeRemaining = data.sessionData.duration;

    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });

  socket.on("session_joined", (data) => {
    console.log("Joined session:", data);
    currentSession = data.sessionData;
    currentPlayer = data.player;

    // Set timer to match session duration
    sessionTimeRemaining = data.sessionData.duration;

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

    // Copy session code to active session page
    document.getElementById("activeSessionCode").textContent =
      currentSession.sessionId;

    // Navigate to active session page
    showPage("session");
    startPostureTracking();
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
    selectedDuration = parseInt(btn.dataset.duration);
    const minutes = selectedDuration / 60;
    document.getElementById("lobbyDuration").textContent = `${minutes} minutes`;

    // Set the timer to match selected duration
    sessionTimeRemaining = selectedDuration;

    // Go to name entry page instead of creating session immediately
    showPage("nameEntry");
  });
});

document.getElementById("cancelDurationBtn").addEventListener("click", () => {
  showPage("mainMenu");
});

// Name Entry Page
document.getElementById("nameConfirmBtn").addEventListener("click", () => {
  const name = document.getElementById("playerNameInput").value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }

  if (name.length > 20) {
    alert("Name must be 20 characters or less");
    return;
  }

  playerName = name;
  console.log("Player name set to:", playerName);

  // If we came from duration selection (creating session)
  if (selectedDuration) {
    console.log(
      "Creating session with name:",
      playerName,
      "duration:",
      selectedDuration,
    );
    socket.emit("create_session", {
      duration: selectedDuration,
      playerName: playerName,
    });
    selectedDuration = null; // Reset
  }
  // If we came from join session
  else if (sessionCodeToJoin) {
    console.log(
      "Joining session:",
      sessionCodeToJoin,
      "with name:",
      playerName,
    );
    socket.emit("join_session", {
      sessionCode: sessionCodeToJoin,
      playerName: playerName,
    });
    sessionCodeToJoin = null; // Reset
  }

  // Clear input for next time
  document.getElementById("playerNameInput").value = "";
});

document.getElementById("cancelNameBtn").addEventListener("click", () => {
  document.getElementById("playerNameInput").value = "";
  selectedDuration = null;
  sessionCodeToJoin = null;
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

  sessionCodeToJoin = sessionCode;

  // Clear input
  document.getElementById("sessionCodeInput").value = "";

  // Go to name entry page
  showPage("nameEntry");
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

// --- Posture Tracking Functions (Integrated with EyePop.ai) ---
let sessionStartTime = null;
let sessionTimeRemaining = 900; // Default 15 mins
let skeletonCanvas = null;
let skeletonCtx = null;
let trackingActive = false;
let timerInterval = null;

// 1. START TRACKING
async function startPostureTracking() {
  console.log("🎮 Real Posture tracking starting...");
  trackingActive = true;

  try {
    // Update timer display immediately with correct time before starting countdown
    updateTimerDisplay();

    // A. Setup Canvas & Camera for the User UI
    initializeSkeletonCanvas();
    await initializeCameraFeed(); // Wait for camera

    // B. Start the Timer
    sessionStartTime = Date.now();
    startTimerCountdown();

    // C. Connect to the "Brain" (Offscreen Document)
    // We send a message to the background script, which ensures offscreen is running
    // and tells it to start processing.
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: "START_TRACKING" });
    } else {
      console.warn("Chrome runtime not available - running in standalone mode");
    }

    // D. Listen for updates from EyePop
    if (chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleEyePopMessage);
    }
  } catch (error) {
    console.error("Failed to start tracking:", error);
    trackingActive = false;
    throw error;
  }
}

// 2. STOP TRACKING
function stopPostureTracking() {
  trackingActive = false;
  console.log("🛑 Posture tracking stopped");

  // Stop Timer
  if (timerInterval) clearInterval(timerInterval);

  // Stop Camera Preview
  const video = document.getElementById("cameraFeed");
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop());
  }

  // Remove Listener
  chrome.runtime.onMessage.removeListener(handleEyePopMessage);

  // Tell Offscreen to stop processing (saves CPU)
  chrome.runtime.sendMessage({ action: "STOP_TRACKING" });
}

// 3. HANDLE MESSAGES FROM EYEPOP (The "Brain")
function handleEyePopMessage(message) {
  if (!trackingActive) return;

  if (message.type === "POSTURE_UPDATE") {
    // 1. Update Score UI
    updateScoreUI(message.score, message.status);

    // 2. Draw Skeleton
    if (message.keypoints) {
      drawSkeletonModel(message.keypoints);
    }
  }
}

function updateScoreUI(score, statusText) {
  const scoreBadge = document.getElementById("scoreBadge");
  const container = document.getElementById("cameraContainer");
  const statusEl = document.getElementById("postureStatus");

  scoreBadge.textContent = Math.round(score);

  // Remove old classes
  container.classList.remove("warning", "danger");
  statusEl.classList.remove("warning", "danger");

  // Apply visual feedback
  if (score >= 70) {
    statusEl.querySelector(".status-text").textContent = "Good Posture";
    statusEl.querySelector(".status-icon").textContent = "✓";
    scoreBadge.style.backgroundColor = "#4ade80"; // Green
  } else if (score >= 40) {
    container.classList.add("warning");
    statusEl.classList.add("warning");
    statusEl.querySelector(".status-text").textContent = "Need Adjustment";
    statusEl.querySelector(".status-icon").textContent = "⚠";
    scoreBadge.style.backgroundColor = "#facc15"; // Yellow
  } else {
    container.classList.add("danger");
    statusEl.classList.add("danger");
    statusEl.querySelector(".status-text").textContent = "Poor Posture";
    statusEl.querySelector(".status-icon").textContent = "✗";
    scoreBadge.style.backgroundColor = "#f87171"; // Red
  }
}

// 4. DRAW SKELETON (Using Real EyePop Keypoints)
function drawSkeletonModel(keypoints) {
  if (!skeletonCtx || !skeletonCanvas) return;

  // Clear canvas
  skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

  // Helper to find a point by label
  const getPoint = (label) => keypoints.find((k) => k.label === label);

  // Map of EyePop labels to our drawing logic
  // EyePop 'Person 2D' typically returns: 'nose', 'left shoulder', 'right shoulder', etc.
  const points = {
    nose: getPoint("nose"),
    lShoulder: getPoint("left shoulder"),
    rShoulder: getPoint("right shoulder"),
    lElbow: getPoint("left elbow"),
    rElbow: getPoint("right elbow"),
    lWrist: getPoint("left wrist"),
    rWrist: getPoint("right wrist"),
    lEye: getPoint("left eye"),
    rEye: getPoint("right eye"),
    lEar: getPoint("left ear"),
    rEar: getPoint("right ear"),
  };

  const video = document.getElementById("cameraFeed");
  if (!video.videoWidth) return; // Video not ready

  // Scaling Factor: EyePop coordinates might be relative (0-1) or absolute.
  // Assuming EyePop returns absolute coordinates based on source video.
  // We need to scale them to match the CURRENT canvas display size.
  const scaleX = skeletonCanvas.width / video.videoWidth;
  const scaleY = skeletonCanvas.height / video.videoHeight;

  skeletonCtx.lineWidth = 3;
  skeletonCtx.strokeStyle = "#4ade80"; // Green skeleton
  skeletonCtx.fillStyle = "#ffffff";

  // Function to draw a line between two points
  const drawLine = (p1, p2) => {
    if (p1 && p2) {
      skeletonCtx.beginPath();
      skeletonCtx.moveTo(p1.x * scaleX, p1.y * scaleY);
      skeletonCtx.lineTo(p2.x * scaleX, p2.y * scaleY);
      skeletonCtx.stroke();
    }
  };

  // Draw Connections
  drawLine(points.nose, points.lShoulder);
  drawLine(points.nose, points.rShoulder);
  drawLine(points.lShoulder, points.rShoulder); // Clavicle
  drawLine(points.lShoulder, points.lElbow);
  drawLine(points.lElbow, points.lWrist);
  drawLine(points.rShoulder, points.rElbow);
  drawLine(points.rElbow, points.rWrist);
  drawLine(points.lEar, points.lShoulder); // Neck lines
  drawLine(points.rEar, points.rShoulder);

  // Draw Dots
  Object.values(points).forEach((p) => {
    if (p) {
      skeletonCtx.beginPath();
      skeletonCtx.arc(p.x * scaleX, p.y * scaleY, 5, 0, 2 * Math.PI);
      skeletonCtx.fill();
    }
  });
}

// --- Helper Functions ---

async function initializeCameraFeed() {
  console.log("📷 Requesting camera access...");
  const video = document.getElementById("cameraFeed");

  if (!video) {
    console.error("Video element not found!");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user",
      },
    });

    console.log("✅ Camera access granted!");
    video.srcObject = stream;

    // Wait for video metadata to load so we know dimensions
    return new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        console.log("📹 Video metadata loaded, playing...");
        video
          .play()
          .then(() => {
            console.log("✅ Video is playing");
            resolve();
          })
          .catch((err) => {
            console.error("Video play error:", err);
            reject(err);
          });
      };

      video.onerror = (err) => {
        console.error("Video element error:", err);
        reject(err);
      };
    });
  } catch (err) {
    console.error("❌ Camera access denied:", err);
    alert(
      "Camera access is required to track your posture. Please allow camera access and try again.",
    );
    throw err;
  }
}

function initializeSkeletonCanvas() {
  skeletonCanvas = document.getElementById("skeletonCanvas");
  skeletonCtx = skeletonCanvas.getContext("2d");

  // Important: Set internal canvas resolution to match display size
  const container = document.getElementById("cameraContainer");

  // Use a ResizeObserver to handle window resizing
  const resizeObserver = new ResizeObserver(() => {
    skeletonCanvas.width = container.offsetWidth;
    skeletonCanvas.height = container.offsetHeight;
  });
  resizeObserver.observe(container);
}

function startTimerCountdown() {
  // Don't call updateTimerDisplay here since it's already called before this
  timerInterval = setInterval(() => {
    sessionTimeRemaining--;
    updateTimerDisplay();
    if (sessionTimeRemaining <= 0) {
      endSession();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(sessionTimeRemaining / 60);
  const s = sessionTimeRemaining % 60;
  document.getElementById("timeRemaining").textContent =
    `${m}:${s.toString().padStart(2, "0")}`;
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
