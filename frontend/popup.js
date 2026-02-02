import { io } from "socket.io-client";
import * as EP from "@eyepop.ai/eyepop";

const { EyePop, PopComponentType, ForwardOperatorType } = EP;

if (!EyePop || !PopComponentType || !ForwardOperatorType) {
  throw new Error("Missing EyePop exports. Check EP exports in console.");
}

// ---------------------------------------------------------------------------
// Global state
// ---------------------------------------------------------------------------
const SOCKET_URL = "http://localhost:3000";
let socket = null;
let currentSession = null;
let currentPlayer = null;
let epEndpoint = null;
let epStream = null;
let epStop = false;

let latestScore = 50;
let scoreEma = 70;

let pages = null;
let trackingInterval = null;
let scoreEmitInterval = null;
let sessionTimeRemaining = 900;
let skeletonCanvas = null;
let skeletonCtx = null;

// Streak / points / green-zone
let greenZoneTime = 0;
let greenZoneStart = null;
let streakSeconds = 0;
let totalPoints = 0;
let lastPointTickAt = null;

// ---------------------------------------------------------------------------
// Visual Intelligence pipeline
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
  pages[pageName]?.classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {
  pages = {
    mainMenu: document.getElementById("mainMenuPage"),
    duration: document.getElementById("durationPage"),
    join: document.getElementById("joinPage"),
    lobby: document.getElementById("lobbyPage"),
    session: document.getElementById("sessionPage"),
    leaderboard: document.getElementById("leaderboardPage"),
  };
});

// ---------------------------------------------------------------------------
// Socket.IO
// ---------------------------------------------------------------------------
function initSocket() {
  if (socket) return;
  socket = io(SOCKET_URL);

  socket.on("connect", () => console.log("Connected:", socket.id));
  socket.on("disconnect", () => console.log("Disconnected"));

  socket.on("session_created", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player;
    sessionTimeRemaining = data.sessionData.duration;
    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });

  socket.on("session_joined", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player;
    sessionTimeRemaining = data.sessionData.duration;
    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });

  socket.on("player_joined", (data) => {
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);
  });

  socket.on("player_left", (data) => {
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);
    if (data.newHost && data.newHost.socketId === socket.id) {
      currentPlayer.isHost = true;
      showHostControls();
    }
  });

  socket.on("session_started", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player || currentPlayer;
    document.getElementById("activeSessionCode").textContent =
      currentSession.sessionId;
    showPage("session");
    startPostureTracking();
  });

  socket.on("leaderboard_update", (data) => {
    if (data?.leaderboard) renderLeaderboard(data.leaderboard);
  });

  socket.on("session_finished", (data) => {
    stopPostureTracking();
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
  for (const player of sessionData.players) {
    const item = document.createElement("div");
    item.className = "player-item";
    item.innerHTML = `
      <span class="player-name">${player.playerName}${player.isHost ? " (Host)" : ""}</span>
      <span class="player-ready">${player.isReady ? "✓" : ""}</span>
    `;
    playersList.appendChild(item);
  }
  if (currentPlayer?.isHost) showHostControls();
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
// Leaderboard
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
// Button wiring
// ---------------------------------------------------------------------------

// Main menu
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
  const code = document.getElementById("sessionCodeInput").value.trim();
  if (!code) { alert("Please enter a session code"); return; }
  if (code.length !== 6) { alert("Session code must be 6 digits"); return; }
  socket.emit("join_session", { sessionCode: code });
  document.getElementById("sessionCodeInput").value = "";
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
  const code = document.getElementById("lobbySessionCode").textContent;
  try { await navigator.clipboard.writeText(code); }
  catch (_) {
    const ta = document.createElement("textarea");
    ta.value = code;
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

// Session
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
// Posture tracking lifecycle
// ---------------------------------------------------------------------------
async function startPostureTracking() {
  sessionTimeRemaining = currentSession?.duration ?? 900;
  greenZoneTime = 0;
  greenZoneStart = null;
  streakSeconds = 0;
  totalPoints = 0;
  lastPointTickAt = null;
  scoreEma = 70;
  latestScore = 50;
  updateTimer();
  initializeSkeletonCanvas();
  resetFeedbackUI();

  // START intervals FIRST — initializeCameraFeed() blocks until stream ends
  trackingInterval = setInterval(() => {
    sessionTimeRemaining--;
    updateTimer();
    if (sessionTimeRemaining <= 0) endSession();
  }, 1000);

  scoreEmitInterval = setInterval(() => {
    if (socket && currentSession) {
      socket.emit("update_score", {
        sessionCode: currentSession.sessionId,
        score: latestScore,
        greenZoneTime: Math.round(
          greenZoneTime +
          (greenZoneStart !== null ? (Date.now() - greenZoneStart) / 1000 : 0)
        ),
      });
    }
  }, 1000);

  try {
    await initializeCameraFeed();
  } catch (err) {
    console.error("initializeCameraFeed failed:", err);
  }
}

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
}

// ---------------------------------------------------------------------------
// Keypoint accumulator — single flat map with TTL
// ---------------------------------------------------------------------------
const KEYPOINT_TTL_MS = 1500;
let kpAccumulator = {};

function accumulateKeypoints(newPoints) {
  const now = Date.now();
  for (const [key, point] of Object.entries(newPoints)) {
    kpAccumulator[key] = { point, ts: now };
  }
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
// EyePop connect → stream (full reconnect each cycle)
// ---------------------------------------------------------------------------
async function connectAndStream() {
  const resp = await fetch(`${SOCKET_URL}/eyepop/session`);
  if (!resp.ok) throw new Error(`Session endpoint ${resp.status}`);
  const session = await resp.json();

  if (epEndpoint) { try { epEndpoint.disconnect(false); } catch (_) {} }
  epEndpoint = await EyePop.workerEndpoint({
    auth: { session },
    popId: session.popId || "transient",
  }).connect();

  await epEndpoint.changePop(PostureVisualIntelligence);
  const resultIterator = await epEndpoint.process({ mediaStream: epStream });

  for await (const result of resultIterator) {
    if (epStop) break;

    const kpGroups = result?.keyPoints;
    if (Array.isArray(kpGroups) && kpGroups.length > 0) {
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

      const kpMap = getAccumulatedKpMap();
      if (Object.keys(kpMap).length > 0) {
        setCameraStatus(true);
        drawSkeleton(kpMap);

        const score = scoreFromKeypoints(kpMap, result.source_width, result.source_height);
        if (score !== null) applyNumericScoreToUI(score);
      }
    }

    const vlm = extractVLMFromResult(result);
    if (vlm) renderFeedbackItems(vlm);

    tickStatsAtTime(Date.now());
  }
}

async function initializeCameraFeed() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("skeletonCanvas");

  epStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = epStream;
  await new Promise((resolve) => (video.onloadedmetadata = resolve));
  await video.play();
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  epStop = false;
  kpAccumulator = {};
  setCameraStatus(false);

  const MAX_RETRIES = 5;
  let retries = 0;

  while (!epStop && epStream) {
    try {
      await connectAndStream();
      if (!epStop) {
        retries = 0;
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      if (epStop) break;
      retries++;
      console.error(`EyePop error (${retries}/${MAX_RETRIES}):`, err?.message || err);
      if (retries >= MAX_RETRIES) {
        setCameraStatus(false);
        break;
      }
      await new Promise(r => setTimeout(r, Math.min(1000 * 2 ** (retries - 1), 16000)));
    }
  }
}

// ---------------------------------------------------------------------------
// Keypoint label normalisation
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
// Posture scoring — green >= 85 | amber 50-84 | red < 50
// ---------------------------------------------------------------------------
function scoreFromKeypoints(kpMap, sourceWidth, sourceHeight) {
  const { nose, leftShoulder: ls, rightShoulder: rs, leftHip: lh, rightHip: rh,
          leftKnee: lk, rightKnee: rk, leftAnkle: la, rightAnkle: ra } = kpMap;

  const isStanding = !!(lk || rk || la || ra);

  // Full torso: nose + both shoulders + both hips
  if (nose && ls && rs && lh && rh) {
    const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
    const midHip      = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
    const torsoVec    = { x: midShoulder.x - midHip.x, y: midShoulder.y - midHip.y };
    const torsoLen    = Math.hypot(torsoVec.x, torsoVec.y) || 1;

    const torsoAngleDeg = Math.abs(Math.atan2(torsoVec.x, -torsoVec.y) * (180 / Math.PI));
    const shoulderTilt  = Math.abs(ls.y - rs.y) / torsoLen;
    const hipTilt       = Math.abs(lh.y - rh.y) / torsoLen;
    const headLateral   = Math.abs(nose.x - midShoulder.x) / torsoLen;
    const noseToShoulderY = (midShoulder.y - nose.y) / torsoLen;
    const headDrop      = Math.max(0, 0.3 - noseToShoulderY);

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
        penalty += (Math.abs(midKnee.x - midHip.x) / torsoLen) * 100;
      }
    } else {
      penalty =
        torsoAngleDeg * 2.5 +
        headLateral   * 200 +
        headDrop      * 200 +
        shoulderTilt  * 180 +
        hipTilt       * 120;
    }

    return applyEma(penalty);
  }

  // Partial: nose + both shoulders
  if (nose && ls && rs) {
    const midSx = (ls.x + rs.x) / 2;
    const midSy = (ls.y + rs.y) / 2;
    const span  = Math.abs(ls.x - rs.x) || 1;

    let penalty = 0;
    penalty += Math.max(0, Math.abs(nose.x - midSx) / span - 0.08) * 350;
    penalty += Math.max(0, 0.35 - (midSy - nose.y) / span) * 180;
    penalty += (Math.abs(ls.y - rs.y) / span) * 250;

    return applyEma(penalty);
  }

  // Minimal: just shoulders
  if (ls && rs) {
    const tilt = Math.abs(ls.y - rs.y) / (sourceHeight || 480);
    const raw = Math.max(20, Math.min(100, Math.round(100 - tilt * 800)));
    scoreEma = 0.80 * scoreEma + 0.20 * raw;
    return Math.round(scoreEma);
  }

  return null;
}

function applyEma(penalty) {
  const raw = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  scoreEma = 0.80 * scoreEma + 0.20 * raw;
  return Math.round(scoreEma);
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
    if (cat) map[cat] = { label: c.classLabel || null, confidence: c.confidence ?? 1 };
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
const BAD_WORDS = ["hunched", "slouched", "poor"];

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
    if (!entry?.label) continue;

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
  document.getElementById("feedbackItems").innerHTML = `
    <div class="feedback-item good">
      <span class="feedback-icon">⏳</span>
      <span>Waiting for camera…</span>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Camera status indicator
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
// Stats: streak, points, green zone
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
    const ticks = Math.floor((now - lastPointTickAt) / 1000);
    if (ticks > 0) {
      totalPoints += ticks;
      lastPointTickAt += ticks * 1000;
    }
  } else {
    lastPointTickAt = null;
  }

  document.getElementById("streakValue").textContent = (streakSeconds / 60).toFixed(1);
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
// Skeleton drawing
// ---------------------------------------------------------------------------
function initializeSkeletonCanvas() {
  const video = document.getElementById("cameraFeed");
  skeletonCanvas = document.getElementById("skeletonCanvas");
  skeletonCtx    = skeletonCanvas.getContext("2d");
  skeletonCanvas.width  = video.videoWidth  || 640;
  skeletonCanvas.height = video.videoHeight || 480;
}

const SKELETON_EDGES = [
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

function drawSkeleton(kpMap) {
  if (!skeletonCtx || !skeletonCanvas) return;
  if (Object.keys(kpMap).length === 0) return;

  skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

  const color = latestScore >= 85 ? "#4caf50" :
                latestScore >= 50 ? "#ffc107" : "#f44336";

  skeletonCtx.strokeStyle = color;
  skeletonCtx.lineWidth   = 3;
  skeletonCtx.shadowBlur  = 6;
  skeletonCtx.shadowColor = color;

  for (const [a, b] of SKELETON_EDGES) {
    const A = kpMap[a];
    const B = kpMap[b];
    if (!A || !B || (A.confidence ?? 1) < 0.15 || (B.confidence ?? 1) < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.moveTo(A.x, A.y);
    skeletonCtx.lineTo(B.x, B.y);
    skeletonCtx.stroke();
  }

  skeletonCtx.fillStyle  = color;
  skeletonCtx.shadowBlur = 10;
  for (const p of Object.values(kpMap)) {
    if ((p.confidence ?? 1) < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.arc(p.x, p.y, 5, 0, Math.PI * 2);
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
// Cleanup on close
// ---------------------------------------------------------------------------
window.addEventListener("beforeunload", () => {
  epStop = true;
  if (socket && currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
  }
});