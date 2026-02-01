// src/background.js

// 1. Listen for the popup asking to start
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "START_TRACKING") {
    setupOffscreen().then(() => {
      // Once created, forward the message to the offscreen document
      chrome.runtime.sendMessage({ action: "START_TRACKING" });
    });
  }
});

// 2. Function to create the invisible offscreen window
async function setupOffscreen() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });

  if (existingContexts.length > 0) {
    return; // Already exists
  }

  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA"],
    justification: "Posture analysis",
  });
}
