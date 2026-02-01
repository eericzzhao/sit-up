import { io } from "socket.io-client";
import * as EP from "@eyepop.ai/eyepop";
import Render2d from "@eyepop.ai/eyepop-render-2d";

const { EyePop, PopComponentType, ForwardOperatorType } = EP;

console.log("EP exports:", Object.keys(EP), EP);

if (!EyePop || !PopComponentType || !ForwardOperatorType) {
  throw new Error("Missing EyePop exports. Check EP exports in console.");
}

// ---------------------------------------------------------------------------
// Global state — all declared up front so ESM strict-mode never hits a
// "used before declaration" ReferenceError.
// ---------------------------------------------------------------------------
const SOCKET_URL = "http://localhost:3000";
let socket = null;
let currentSession = null;
let currentPlayer = null;
let playerName = ""; // Store player name
let selectedDuration = null; // Store selected duration
let sessionCodeToJoin = null; // Store session code when joining
let epEndpoint = null;
let epStream = null;
let epStop = false;

let latestScore = 50;
let latestPostureLabel = null;
let scoreEma = 70;
let viewOrientation = "front";  // "front" or "side"

let pages = null;
let trackingInterval = null;
let scoreEmitInterval = null;
let sessionTimeRemaining = 900;
let skeletonCanvas = null;
let skeletonCtx = null;

// ---------------------------------------------------------------------------
// Streak / points / green-zone — all driven by real wall-clock time
// ---------------------------------------------------------------------------
let greenZoneTime = 0;          // total seconds with score >= 85
let greenZoneStart = null;      // Date.now() when the current green streak began (null = not in green)
let streakSeconds = 0;          // current continuous green-zone streak in seconds
let totalPoints = 0;            // accumulated points this session
let lastPointTickAt = null;     // timestamp of last point-tick so we award points at a steady 1/s

// ---------------------------------------------------------------------------
// Visual Intelligence pipeline definition
// ---------------------------------------------------------------------------
const PostureVisualIntelligence = {
  components: [{
    type: PopComponentType.INFERENCE,
    ability: "eyepop.person.2d-body-points:latest",
    categoryName: "person",
    confidenceThreshold: 0.5,
    forward: {
      operator: { type: ForwardOperatorType.CROP },
      targets: [{
        type: PopComponentType.INFERENCE,
        ability: "eyepop.image-contents:latest",
        params: {
          prompts: [{
            prompt:
              "Analyze the person's posture in this image and determine the categories of: " +
              [
                "Head position (Neutral, Forward-leaning, Tilted left, Tilted right)",
                "Shoulder alignment (Level, Left higher, Right higher, Rounded/slouched)",
                "Back position (Straight, Slightly curved, Hunched, Slouched)",
                "Neck angle (Neutral, Forward, Strained)",
                "Overall posture score (Good, Fair, Poor)",
                "Describe any posture issues observed",
              ].join(", ") +
              ". Report the values of the categories as classLabels. " +
              "If you are unable to provide a category with a value then set its classLabel to null",
          }],
        },
      }],
    },
  }],
};

// ---------------------------------------------------------------------------
// Page navigation
// ---------------------------------------------------------------------------
function showPage(pageName) {
  if (!pages) return;
  Object.values(pages).forEach((p) => p.classList.remove("active"));
  pages[pageName].classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {
  pages = {
    mainMenu: document.getElementById("mainMenuPage"),
    duration: document.getElementById("durationPage"),
    nameEntry: document.getElementById("nameEntryPage"),
  join: document.getElementById("joinPage"),
    lobby: document.getElementById("lobbyPage"),
    session: document.getElementById("sessionPage"),
    leaderboard: document.getElementById("leaderboardPage"),
  };
  
  // Try to resume an active session from localStorage
  resumePersistedSession();
});

// ---------------------------------------------------------------------------
// Socket.IO
// ---------------------------------------------------------------------------
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
    currentPlayer = data.player || currentPlayer;
    document.getElementById("activeSessionCode").textContent =
      currentSession.sessionId;
    persistSessionState();
    showPage("session");
    startPostureTracking();
  });

  socket.on("leaderboard_update", (data) => {
    if (!data?.leaderboard) return;
    renderLeaderboard(data.leaderboard);
  });

  socket.on("session_finished", (data) => {
    console.log("Session finished:", data);
    stopPostureTracking();
    clearSessionState();
    alert(
      `Session finished!\nWinner: ${data.winner.playerName} with ${data.winner.greenZoneTime}s in green zone`
    );
    showPage("mainMenu");
  });

  socket.on("error", (data) => {
    console.error("Socket error:", data.message);
    alert(data.message);
  });
}

// ---------------------------------------------------------------------------
// Lobby UI
// ---------------------------------------------------------------------------
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
  if (currentPlayer && currentPlayer.isHost) showHostControls();
  else hideHostControls();
}

function showHostControls() {
  document.getElementById("startSessionBtn").style.display = "block";
  document.getElementById("waitingMessage").style.display = "none";
}
function hideHostControls() {
  document.getElementById("startSessionBtn").style.display = "none";
  document.getElementById("waitingMessage").style.display = "block";
}

// ---------------------------------------------------------------------------
// Leaderboard renderer
// ---------------------------------------------------------------------------
function renderLeaderboard(leaderboard) {
  const list = document.getElementById("leaderboardFullList");
  list.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];
  leaderboard.forEach((entry, i) => {
    const isYou = currentPlayer && entry.playerName === currentPlayer.playerName;
    const item = document.createElement("div");
    item.className = `leaderboard-item rank-${i + 1}${isYou ? " highlight" : ""}`;
    item.innerHTML = `
      <span class="rank">${i < 3 ? medals[i] : "#" + (i + 1)}</span>
      <div class="player-info">
        <span class="player">${isYou ? "You" : entry.playerName}</span>
        <span class="player-stats">${entry.score} pts · ${entry.greenZoneTime}s green</span>
      </div>
    `;
    list.appendChild(item);
    if (isYou) {
      document.getElementById("rankValue").textContent = `#${i + 1}`;
      document.getElementById("yourRankLarge").textContent = `#${i + 1}`;
      document.getElementById("yourScoreLarge").textContent = entry.score;
    }
  });
}

// ---------------------------------------------------------------------------
// Button wiring — Main Menu
// ---------------------------------------------------------------------------
document.getElementById("createSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("duration");
});
document.getElementById("joinSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("join");
});

// Duration
document.querySelectorAll(".duration-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const duration = parseInt(btn.dataset.duration);
    document.getElementById("lobbyDuration").textContent =
      `${duration / 60} minutes`;
    socket.emit("create_session", { duration });
  });
});
document.getElementById("cancelDurationBtn").addEventListener("click", () => {
  showPage("mainMenu");
});

// Join
document.getElementById("joinConfirmBtn").addEventListener("click", () => {
  const sessionCode = document.getElementById("sessionCodeInput").value.trim();
  if (!sessionCode) { alert("Please enter a session code"); return; }
  if (sessionCode.length !== 6) { alert("Session code must be 6 digits"); return; }
  socket.emit("join_session", { sessionCode });
  document.getElementById("sessionCodeInput").value = "";

  // Go to name entry page
  showPage("nameEntry");
});
document.getElementById("cancelJoinBtn").addEventListener("click", () => {
  document.getElementById("sessionCodeInput").value = "";
  showPage("mainMenu");
});
document.getElementById("sessionCodeInput").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
});

// Lobby
document.getElementById("copyLinkBtn").addEventListener("click", async () => {
  const sessionCode = document.getElementById("lobbySessionCode").textContent;
  try {
    await navigator.clipboard.writeText(sessionCode);
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = sessionCode;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const btn = document.getElementById("copyLinkBtn");
  const orig = btn.textContent;
  btn.textContent = "[Copied!]";
  setTimeout(() => { btn.textContent = orig; }, 2000);
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

// Session page
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
  document.getElementById("leaderboardSessionCode").textContent =
    document.getElementById("activeSessionCode").textContent;
  showPage("leaderboard");
});

document.getElementById("backToSessionBtn").addEventListener("click", () => {
  showPage("session");
});

// ---------------------------------------------------------------------------
// Session persistence helpers
// ---------------------------------------------------------------------------
function persistSessionState() {
  if (!currentSession || !currentPlayer) return;
  const state = {
    sessionId: currentSession.sessionId,
    duration: currentSession.duration,
    playerName: currentPlayer.playerName,
    playerId: currentPlayer.playerId,
    isHost: currentPlayer.isHost,
    sessionStartTime: Date.now(),
  };
  localStorage.setItem("activeGameSession", JSON.stringify(state));
  console.log("📝 Session persisted to localStorage", state);
}

function clearSessionState() {
  localStorage.removeItem("activeGameSession");
  console.log("🗑️ Session cleared from localStorage");
}

function getPersistedSession() {
  try {
    const data = localStorage.getItem("activeGameSession");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to parse persisted session:", e);
    return null;
  }
}

async function resumePersistedSession() {
  const persisted = getPersistedSession();
  if (!persisted) return;
  
  console.log("🔄 Attempting to resume session:", persisted);
  initSocket();
  
  // Small delay to ensure socket is ready
  await new Promise(r => setTimeout(r, 500));
  
  // Rejoin the session
  if (socket && socket.connected) {
    socket.emit("rejoin_session", {
      sessionCode: persisted.sessionId,
      playerName: persisted.playerName,
    });
  }
}

// ---------------------------------------------------------------------------
// Posture tracking lifecycle
// ---------------------------------------------------------------------------
async function startPostureTracking() {
  console.log("🎮 Posture tracking started");

  sessionTimeRemaining = currentSession?.duration ?? 900;
  greenZoneTime = 0;
  greenZoneStart = null;
  streakSeconds = 0;
  totalPoints = 0;
  lastPointTickAt = null;
  scoreEma = 70;
  latestScore = 50;
  viewOrientation = "front";
  updateTimer();
  initializeSkeletonCanvas();
  resetFeedbackUI();

  try {
    await initializeCameraFeed();
    console.log("✅ EyePop loop started");
  } catch (err) {
    console.error("❌ initializeCameraFeed failed:", err);
    alert("EyePop failed to start. Check console for the exact error.");
    return;
  }

  // Countdown
  trackingInterval = setInterval(() => {
    sessionTimeRemaining--;
    updateTimer();
    if (sessionTimeRemaining <= 0) endSession();
  }, 1000);

  // Push score to server every second
  scoreEmitInterval = setInterval(() => {
    if (socket && currentSession) {
      socket.emit("update_score", {
        sessionCode: currentSession.sessionId,
        score: latestScore,
        greenZoneTime: Math.round(
          greenZoneTime +
            (greenZoneStart !== null
              ? (Date.now() - greenZoneStart) / 1000
              : 0)
        ),
      });
    }
  }, 1000);
}

// ---------------------------------------------------------------------------
// 2. STOP TRACKING
// ---------------------------------------------------------------------------
function stopPostureTracking() {
  epStop = true;
  if (trackingInterval) { clearInterval(trackingInterval); trackingInterval = null; }
  if (scoreEmitInterval) { clearInterval(scoreEmitInterval); scoreEmitInterval = null; }

  const video = document.getElementById("cameraFeed");
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  }
  if (epEndpoint) {
    epEndpoint.disconnect(false).catch(() => {});
    epEndpoint = null;
  }
  epStream = null;
  console.log("🛑 Posture tracking stopped");
}

// ---------------------------------------------------------------------------
// Keypoint accumulator — SINGLE FLAT accumulator
// ---------------------------------------------------------------------------
// WHY: EyePop sends result.keyPoints = [{ category:"person", id:<N>, points }]
// The `id` is auto-incrementing and changes every frame — it is NOT a stable
// person ID.  Each frame typically has 1 group with a partial set of keypoints
// (e.g. just eyes, or just shoulders).  We merge them all into one flat map
// with a 1.5s TTL so we always have the most complete skeleton.
//
// Person count: we use kpGroups.length from the CURRENT frame only.
// This avoids the 60-person phantom accumulation bug.
const KEYPOINT_TTL_MS = 1500;
let kpAccumulator = {};  // key → { point, ts }

function accumulateKeypoints(newPoints) {
  const now = Date.now();
  // Merge incoming
  for (const [key, point] of Object.entries(newPoints)) {
    kpAccumulator[key] = { point, ts: now };
  }
  // Expire stale
  for (const key of Object.keys(kpAccumulator)) {
    if (now - kpAccumulator[key].ts > KEYPOINT_TTL_MS) {
      delete kpAccumulator[key];
    }
  }
}

function getAccumulatedKpMap() {
  const now = Date.now();
  const result = {};
  for (const [key, entry] of Object.entries(kpAccumulator)) {
    if (now - entry.ts < KEYPOINT_TTL_MS) {
      result[key] = entry.point;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// EyePop connect → stream cycle (full reconnect each time)
// ---------------------------------------------------------------------------
async function connectAndStream() {
  const resp = await fetch(`${SOCKET_URL}/eyepop/session`);
  if (!resp.ok) throw new Error(`Session ${resp.status}: ${await resp.text()}`);
  const session = await resp.json();
  console.log("✅ Got EyePop session:", {
    eyepopUrl: session.eyepopUrl,
    popId: session.popId,
    validUntil: new Date(session.validUntil).toISOString(),
  });

  if (epEndpoint) { try { epEndpoint.disconnect(false); } catch (_) {} }
  epEndpoint = await EyePop.workerEndpoint({
    auth: { session },
    popId: session.popId || "transient",
  }).connect();
  console.log("✅ EyePop endpoint connected");

  await epEndpoint.changePop(PostureVisualIntelligence);
  console.log("✅ PostureVisualIntelligence pipeline loaded");

  const resultIterator = await epEndpoint.process({ mediaStream: epStream });
  console.log("✅ Live webcam ingress started");

  let debugCount = 0;

  for await (const result of resultIterator) {
    if (epStop) break;

    // Log first 3 results for debugging
    if (debugCount < 3) {
      console.log(`[EyePop result #${debugCount}]`, JSON.stringify(result, null, 2));
      debugCount++;
    }

    // --- Process keypoint groups ---
    // Shape: result.keyPoints = [{ category:"person", id:<N>, points:[{classLabel, x, y, confidence}] }]
    const kpGroups = result?.keyPoints;
    if (Array.isArray(kpGroups) && kpGroups.length > 0) {
      // Merge ALL points from all groups into flat accumulator
      for (const group of kpGroups) {
        const points = Array.isArray(group?.points) ? group.points : [];
        const batch = {};
        for (const p of points) {
          const key = normalizeLabel(p?.classLabel);
          if (key) batch[key] = p;
        }
        if (Object.keys(batch).length > 0) {
          accumulateKeypoints(batch);
        }
      }

      // Get full accumulated skeleton
      const kpMap = getAccumulatedKpMap();
      const kpCount = Object.keys(kpMap).length;

      if (kpCount > 0) {
        setCameraStatus(true);
        drawSkeleton(kpMap);

        const score = scoreFromKeypoints(kpMap, result.source_width, result.source_height);
        if (score !== null) {
          applyNumericScoreToUI(score);
        }

        // Person count from THIS frame only (not accumulated)
        const statusText = document.querySelector("#cameraStatus .status-text");
        if (kpGroups.length > 1) {
          statusText.textContent = `Tracking (${kpGroups.length} people)`;
        } else {
          statusText.textContent = "Tracking";
        }
      }
    }

    // --- VLM feedback ---
    const vlm = extractVLMFromResult(result);
    if (vlm) {
      renderFeedbackItems(vlm);
      latestPostureLabel = vlm["overall posture score"]?.label || null;
    }

    tickStatsAtTime(Date.now());
  }
}

async function initializeCameraFeed() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("skeletonCanvas");

  try {
    epStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = epStream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    await video.play();
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    console.log("✅ Webcam started", video.videoWidth, "x", video.videoHeight);
  } catch (err) {
    console.error("Webcam access failed:", err);
    alert("Camera access denied. Please allow camera permissions and try again.");
    return;
  }

  epStop = false;
  kpAccumulator = {};
  setCameraStatus(false);

  const MAX_RETRIES = 5;
  let retries = 0;

  while (!epStop && epStream) {
    try {
      await connectAndStream();
      if (!epStop) {
        console.log("⏳ EyePop stream ended, reconnecting...");
        retries = 0;
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      if (epStop) break;
      retries++;
      console.error(`❌ EyePop error (attempt ${retries}/${MAX_RETRIES}):`, err?.message || err);
      if (retries >= MAX_RETRIES) {
        console.error("Max retries reached. Stopping.");
        setCameraStatus(false);
        break;
      }
      await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, retries - 1), 16000)));
    }
  }
  console.log("EyePop processing loop ended");
}

// ---------------------------------------------------------------------------
// Keypoint label normalisation — "left shoulder" → "leftShoulder"
// ---------------------------------------------------------------------------
function normalizeLabel(label) {
  if (!label) return null;
  const s = String(label).toLowerCase().replace(/[\s\-]+/g, "_").trim();
  const alias = {
    nose: "nose", neck: "neck",
    left_eye: "leftEye",             right_eye: "rightEye",
    left_ear: "leftEar",             right_ear: "rightEar",
    left_shoulder: "leftShoulder",   right_shoulder: "rightShoulder",
    left_elbow: "leftElbow",         right_elbow: "rightElbow",
    left_wrist: "leftWrist",         right_wrist: "rightWrist",
    left_hip: "leftHip",             right_hip: "rightHip",
    left_knee: "leftKnee",           right_knee: "rightKnee",
    left_ankle: "leftAnkle",         right_ankle: "rightAnkle",
  };
  return alias[s] || alias[s.replace(/_/g, "")] || label;
}

// ---------------------------------------------------------------------------
// Posture score — sitting AND standing (with side-view support)
// ---------------------------------------------------------------------------
// Thresholds:  green >= 85  |  amber 50-84  |  red < 50

/**
 * Detect the person's view orientation (front vs side)
 * Side view: one shoulder is much more visible than the other
 */
function detectViewOrientation(kpMap) {
  const { leftShoulder: ls, rightShoulder: rs, leftHip: lh, rightHip: rh,
          leftEye: le, rightEye: re, leftEar: ler, rightEar: rer } = kpMap;
  
  // Check shoulder visibility imbalance
  const lsConf = ls?.confidence ?? 0;
  const rsConf = rs?.confidence ?? 0;
  const shoulderImbalance = Math.abs(lsConf - rsConf);
  
  // Check eye/ear visibility imbalance (even stronger indicator)
  const eyeConf = {
    left: Math.max(le?.confidence ?? 0, ler?.confidence ?? 0),
    right: Math.max(re?.confidence ?? 0, rer?.confidence ?? 0),
  };
  const eyeImbalance = Math.abs(eyeConf.left - eyeConf.right);
  
  // If imbalance is significant, person is turned to side
  if (shoulderImbalance > 0.35 || eyeImbalance > 0.4) {
    return "side";
  }
  return "front";
}

/**
 * Score from side-view keypoints (only one side visible)
 */
function scoreFromSideView(kpMap, sourceWidth, sourceHeight) {
  // Use whichever shoulder/hip is more visible
  const { nose, leftShoulder: ls, rightShoulder: rs, leftHip: lh, rightHip: rh,
          leftKnee: lk, rightKnee: rk, leftAnkle: la, rightAnkle: ra } = kpMap;
  
  const lsConf = ls?.confidence ?? 0;
  const rsConf = rs?.confidence ?? 0;
  const useLeft = lsConf > rsConf;
  
  const shoulder = useLeft ? ls : rs;
  const hip = useLeft ? lh : rh;
  const knee = useLeft ? lk : rk;
  const ankle = useLeft ? la : ra;
  
  if (!shoulder || (!hip && !nose)) return null;
  
  // Side view checks: vertical alignment is key
  const torsoVec = hip ? { x: shoulder.x - hip.x, y: shoulder.y - hip.y } : null;
  const torsoLen = torsoVec ? Math.hypot(torsoVec.x, torsoVec.y) || 1 : sourceHeight || 480;
  
  let penalty = 0;
  
  // 1. Side-view spine/torso alignment (should be vertical)
  if (torsoVec) {
    const spineAngleDeg = Math.abs(Math.atan2(torsoVec.x, -torsoVec.y) * (180 / Math.PI));
    penalty += spineAngleDeg * 3.5;
  }
  
  // 2. Head alignment relative to shoulder
  if (nose && shoulder) {
    const headToShoulderX = Math.abs(nose.x - shoulder.x) / torsoLen;
    const headToShoulderY = (shoulder.y - nose.y) / torsoLen;
    
    penalty += Math.max(0, headToShoulderX - 0.1) * 400;
    penalty += Math.max(0, 0.3 - headToShoulderY) * 250;
  }
  
  // 3. Knee/ankle alignment for standing side view
  if (knee && hip) {
    const kneeLateral = Math.abs(knee.x - hip.x) / torsoLen;
    penalty += kneeLateral * 80;
  }
  if (ankle && knee) {
    const footLateral = Math.abs(ankle.x - knee.x) / torsoLen;
    penalty += Math.max(0, footLateral) * 100;
  }
  
  const raw = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  scoreEma = 0.75 * scoreEma + 0.25 * raw;
  return Math.round(scoreEma);
}

function scoreFromKeypoints(kpMap, sourceWidth, sourceHeight) {
  const { nose, leftShoulder: ls, rightShoulder: rs, leftHip: lh, rightHip: rh,
          leftKnee: lk, rightKnee: rk, leftAnkle: la, rightAnkle: ra } = kpMap;

  // Detect view orientation
  viewOrientation = detectViewOrientation(kpMap);
  
  // If person is turned to the side, use side-view scoring
  if (viewOrientation === "side") {
    const sideScore = scoreFromSideView(kpMap, sourceWidth, sourceHeight);
    if (sideScore !== null) return sideScore;
  }

  const isStanding = !!(lk || rk || la || ra);

  // ---- Full torso: nose + shoulders + hips ----
  if (nose && ls && rs && lh && rh) {
    const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
    const midHip      = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
    const torsoVec = { x: midShoulder.x - midHip.x, y: midShoulder.y - midHip.y };
    const torsoLen = Math.hypot(torsoVec.x, torsoVec.y) || 1;

    const torsoAngleDeg = Math.abs(Math.atan2(torsoVec.x, -torsoVec.y) * (180 / Math.PI));
    const shoulderTilt = Math.abs(ls.y - rs.y) / torsoLen;
    const hipTilt = Math.abs(lh.y - rh.y) / torsoLen;
    const headLateral = Math.abs(nose.x - midShoulder.x) / torsoLen;
    const noseToShoulderY = (midShoulder.y - nose.y) / torsoLen;
    const headDrop = Math.max(0, 0.3 - noseToShoulderY);

    let penalty;
    if (isStanding) {
      penalty =
        torsoAngleDeg * 3.0 +
        headLateral   * 180 +
        headDrop      * 250 +
        shoulderTilt  * 200 +
        hipTilt       * 150;
      if (lk && rk) {
        const midKnee = { x: (lk.x + rk.x) / 2 };
        const kneeLateral = Math.abs(midKnee.x - midHip.x) / torsoLen;
        penalty += kneeLateral * 100;
      }
    } else {
      penalty =
        torsoAngleDeg * 2.5 +
        headLateral   * 200 +
        headDrop      * 200 +
        shoulderTilt  * 180 +
        hipTilt       * 120;
    }

    const raw = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    scoreEma = 0.80 * scoreEma + 0.20 * raw;
    return Math.round(scoreEma);
  }

  // ---- Partial: nose + shoulders ----
  if (nose && ls && rs) {
    const midSx = (ls.x + rs.x) / 2;
    const midSy = (ls.y + rs.y) / 2;
    const shoulderSpan = Math.abs(ls.x - rs.x) || 1;

    const headOffsetX = Math.abs(nose.x - midSx) / shoulderSpan;
    const headOffsetY = (midSy - nose.y) / shoulderSpan;
    const shoulderTilt = Math.abs(ls.y - rs.y) / shoulderSpan;

    let penalty = 0;
    penalty += Math.max(0, headOffsetX - 0.08) * 350;
    penalty += Math.max(0, 0.35 - headOffsetY) * 180;
    penalty += shoulderTilt * 250;

    const raw = Math.max(0, Math.min(100, Math.round(100 - penalty)));
    scoreEma = 0.80 * scoreEma + 0.20 * raw;
    return Math.round(scoreEma);
  }

  // ---- Minimal: just shoulders ----
  if (ls && rs) {
    const tilt = Math.abs(ls.y - rs.y) / (sourceHeight || 480);
    const raw = Math.max(20, Math.min(100, Math.round(100 - tilt * 800)));
    scoreEma = 0.80 * scoreEma + 0.20 * raw;
    return Math.round(scoreEma);
  }

  return null;
}

// ---------------------------------------------------------------------------
// VLM class extraction
// ---------------------------------------------------------------------------
function extractVLMFromResult(result) {
  const allClasses = [];
  if (Array.isArray(result?.classes)) allClasses.push(...result.classes);
  if (Array.isArray(result?.objects)) {
    for (const obj of result.objects) {
      if (Array.isArray(obj?.classes)) allClasses.push(...obj.classes);
      if (Array.isArray(obj?.objects)) {
        for (const child of obj.objects) {
          if (Array.isArray(child?.classes)) allClasses.push(...child.classes);
        }
      }
    }
  }
  if (allClasses.length === 0) return null;

  const map = {};
  for (const c of allClasses) {
    const cat = String(c?.category ?? "").toLowerCase().trim();
    if (!cat) continue;
    map[cat] = { label: c.classLabel || null, confidence: c.confidence ?? 1 };
  }
  return Object.keys(map).length > 0 ? map : null;
}

// ---------------------------------------------------------------------------
// Feedback panel
// ---------------------------------------------------------------------------
const FEEDBACK_CATEGORIES = [
  { key: "head position",       label: "Head position" },
  { key: "shoulder alignment",  label: "Shoulders" },
  { key: "back position",       label: "Back position" },
  { key: "neck angle",          label: "Neck angle" },
  { key: "overall posture score", label: "Overall posture" },
  { key: "describe any posture issues observed", label: "Issues" },
];

const WARNING_WORDS = ["forward-leaning", "tilted", "higher", "rounded", "slouched",
                       "slightly curved", "forward", "strained", "fair"];
const BAD_WORDS      = ["hunched", "slouched", "poor"];

function classifyLabel(label) {
  if (!label) return "good";
  const l = label.toLowerCase();
  if (BAD_WORDS.some((w) => l.includes(w))) return "bad";
  if (WARNING_WORDS.some((w) => l.includes(w))) return "warning";
  return "good";
}

function renderFeedbackItems(vlmMap) {
  const container = document.getElementById("feedbackItems");
  container.innerHTML = "";

  for (const { key, label } of FEEDBACK_CATEGORIES) {
    const entry = vlmMap[key] || findClosestKey(vlmMap, key);
    if (!entry || !entry.label) continue;

    const tier = classifyLabel(entry.label);
    const icon = tier === "good" ? "✓" : tier === "warning" ? "⚠" : "✗";

    const item = document.createElement("div");
    item.className = `feedback-item ${tier}`;
    item.innerHTML = `
      <span class="feedback-icon">${icon}</span>
      <span><strong>${label}:</strong> ${entry.label}</span>
    `;
    container.appendChild(item);
  }

  if (container.children.length === 0) {
    const item = document.createElement("div");
    item.className = "feedback-item good";
    item.innerHTML = `<span class="feedback-icon">✓</span><span>Awaiting analysis…</span>`;
    container.appendChild(item);
  }
}

function findClosestKey(vlmMap, target) {
  const t = target.toLowerCase();
  for (const k of Object.keys(vlmMap)) {
    if (k.startsWith(t) || t.startsWith(k)) return vlmMap[k];
  }
  return null;
}

function resetFeedbackUI() {
  const container = document.getElementById("feedbackItems");
  container.innerHTML = `
    <div class="feedback-item good">
      <span class="feedback-icon">⏳</span>
      <span>Waiting for camera…</span>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Camera-status indicator
// ---------------------------------------------------------------------------
function setCameraStatus(personDetected) {
  const dot  = document.querySelector("#cameraStatus .status-dot");
  const text = document.querySelector("#cameraStatus .status-text");
  if (personDetected) {
    dot.style.backgroundColor = "";
    text.textContent = "Tracking";
  } else {
    dot.style.backgroundColor = "#f44336";
    text.textContent = "No Person Detected";
  }
}

// ---------------------------------------------------------------------------
// Stats ticker
// ---------------------------------------------------------------------------
const GREEN_THRESHOLD = 85;

function tickStatsAtTime(now) {
  const inGreen = latestScore >= GREEN_THRESHOLD;

  if (inGreen) {
    if (greenZoneStart === null) greenZoneStart = now;
    streakSeconds = (now - greenZoneStart) / 1000;
  } else {
    if (greenZoneStart !== null) {
      greenZoneTime += (now - greenZoneStart) / 1000;
      greenZoneStart = null;
    }
    streakSeconds = 0;
  }

  if (inGreen) {
    if (lastPointTickAt === null) lastPointTickAt = now;
    const elapsed = now - lastPointTickAt;
    const ticks  = Math.floor(elapsed / 1000);
    if (ticks > 0) {
      totalPoints += ticks;
      lastPointTickAt += ticks * 1000;
    }
  } else {
    lastPointTickAt = null;
  }

  const streakMin = (streakSeconds / 60).toFixed(1);
  document.getElementById("streakValue").textContent = streakMin;
  document.getElementById("pointsValue").textContent = `+${totalPoints}`;
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
function applyNumericScoreToUI(score) {
  latestScore = score;
  document.getElementById("scoreBadge").textContent = String(score);
  updatePostureStatusFromScore(score);
}

function updatePostureStatusFromScore(score) {
  const container = document.getElementById("cameraContainer");
  const status    = document.getElementById("postureStatus");

  container.classList.remove("warning", "danger");
  status.classList.remove("warning", "danger");

  if (score >= 85) {
    status.querySelector(".status-text").textContent = "Good Posture";
    status.querySelector(".status-icon").textContent = "✓";
  } else if (score >= 50) {
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

function updateTimer() {
  const m = Math.floor(sessionTimeRemaining / 60);
  const s = sessionTimeRemaining % 60;
  document.getElementById("timeRemaining").textContent =
    `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Skeleton drawing — single accumulated skeleton, score-based colour
// ---------------------------------------------------------------------------
function initializeSkeletonCanvas() {
  const video = document.getElementById("cameraFeed");
  skeletonCanvas = document.getElementById("skeletonCanvas");
  skeletonCtx    = skeletonCanvas.getContext("2d");
  skeletonCanvas.width  = video.videoWidth  || 640;
  skeletonCanvas.height = video.videoHeight || 480;
}

function drawSkeleton(kpMap) {
  if (!skeletonCtx || !skeletonCanvas) return;
  if (Object.keys(kpMap).length === 0) return;  // keep last frame

  skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

  const toXY = (p) => {
    if (!p) return null;
    return { x: p.x, y: p.y, confidence: p.confidence ?? 1 };
  };

  const edges = [
    ["nose","leftEye"],    ["nose","rightEye"],
    ["leftEye","leftEar"], ["rightEye","rightEar"],
    ["nose","leftShoulder"],  ["nose","rightShoulder"],
    ["leftShoulder","rightShoulder"],
    ["leftShoulder","leftElbow"],   ["rightShoulder","rightElbow"],
    ["leftElbow","leftWrist"],      ["rightElbow","rightWrist"],
    ["leftShoulder","leftHip"],     ["rightShoulder","rightHip"],
    ["leftHip","rightHip"],
    ["leftHip","leftKnee"],         ["rightHip","rightKnee"],
    ["leftKnee","leftAnkle"],       ["rightKnee","rightAnkle"],
  ];

  // Colour tracks score
  const color = latestScore >= 85 ? "#4caf50" :
                latestScore >= 50 ? "#ffc107" : "#f44336";

  skeletonCtx.strokeStyle = color;
  skeletonCtx.lineWidth   = 3;
  skeletonCtx.shadowBlur  = 6;
  skeletonCtx.shadowColor = color;

  for (const [a, b] of edges) {
    const A = toXY(kpMap[a]);
    const B = toXY(kpMap[b]);
    if (!A || !B || A.confidence < 0.15 || B.confidence < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.moveTo(A.x, A.y);
    skeletonCtx.lineTo(B.x, B.y);
    skeletonCtx.stroke();
  }

  skeletonCtx.fillStyle  = color;
  skeletonCtx.shadowBlur = 10;
  for (const p of Object.values(kpMap)) {
    const P = toXY(p);
    if (!P || P.confidence < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.arc(P.x, P.y, 5, 0, Math.PI * 2);
    skeletonCtx.fill();
  }

  skeletonCtx.shadowBlur = 0;
}

// ---------------------------------------------------------------------------
// Session end
// ---------------------------------------------------------------------------
function endSession() {
  if (greenZoneStart !== null) {
    greenZoneTime += (Date.now() - greenZoneStart) / 1000;
    greenZoneStart = null;
  }
  stopPostureTracking();
  alert("🎉 Session Complete!\n\nGreat job maintaining your posture!");
  showPage("mainMenu");
}

// ---------------------------------------------------------------------------
// Cleanup on popup close
// ---------------------------------------------------------------------------
window.addEventListener("beforeunload", () => {
  epStop = true;
  if (socket && currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
  }
});