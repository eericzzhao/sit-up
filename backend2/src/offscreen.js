import { EyePop } from "@eyepop.ai/eyepop";

// TODO: Replace with your actual UUID and API Key from the EyePop Dashboard
const POP_UUID = "YOUR_POP_UUID";
const API_KEY = "YOUR_API_KEY";

let isTracking = false;
let endpoint = null;

console.log("🧠 Offscreen Brain loaded");

// --- 1. Message Listener ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "START_TRACKING") {
    if (!isTracking) {
      startTracking();
    }
  } else if (msg.action === "STOP_TRACKING") {
    stopTracking();
  }
});

// --- 2. Main Tracking Logic ---
async function startTracking() {
  try {
    console.log("Starting EyePop connection...");
    isTracking = true;

    // Connect to EyePop
    endpoint = await EyePop.endpoint({
      auth: { apiKey: API_KEY },
      popId: POP_UUID,
    }).connect();

    // Capture the "Offscreen" webcam (invisible to user, distinct from Popup webcam)
    // Chrome requires this specific reason to be declared in manifest
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });

    console.log("Offscreen camera acquired, processing...");

    // Process the stream
    const results = await endpoint.process(stream);

    // Loop through results as they arrive
    for await (const result of results) {
      if (!isTracking) break; // Exit if stopped

      if (result.objects) {
        // Look for a person object
        const person = result.objects.find((o) => o.classLabel === "person");

        if (person && person.keypoints) {
          const scoreData = calculatePostureScore(person.keypoints);

          // Broadcast result to Popup.js
          chrome.runtime.sendMessage({
            type: "POSTURE_UPDATE",
            score: scoreData.score,
            status: scoreData.status,
            keypoints: person.keypoints,
          });
        }
      }
    }
  } catch (err) {
    console.error("EyePop Error:", err);
    // Notify popup of error
    chrome.runtime.sendMessage({ type: "ERROR", message: err.message });
    isTracking = false;
  }
}

function stopTracking() {
  console.log("Stopping tracking...");
  isTracking = false;
  if (endpoint) {
    endpoint.disconnect();
    endpoint = null;
  }
}

// --- 3. Posture Math ---
function calculatePostureScore(keypoints) {
  // Helper to find points safely
  const get = (label) => keypoints.find((k) => k.label === label);

  const lShoulder = get("left shoulder");
  const rShoulder = get("right shoulder");
  const nose = get("nose");
  const lEar = get("left ear");
  const rEar = get("right ear");

  if (!lShoulder || !rShoulder) {
    return { score: 0, status: "No person detected" };
  }

  const shoulderTilt = Math.abs(lShoulder.y - rShoulder.y);

  const shoulderMidY = (lShoulder.y + rShoulder.y) / 2;
  const noseDistance = Math.abs(shoulderMidY - (nose ? nose.y : 0));

  let penalty = shoulderTilt * 400;

  let score = 100 - penalty;
  score = Math.max(0, Math.min(100, score));

  let status = "Good Posture";
  if (score < 70) status = "Sit Straight";
  if (score < 40) status = "Poor Posture";

  return { score, status };
}
