# sit-up
computer vision eyepop posture game for the SanD Hacks hackathon
# SitUp — Posture Competition Chrome Extension 

**SitUp** is a Chrome extension that turns “good posture” into a lightweight multiplayer competition. It uses **EyePop** to detect body keypoints, draws a live **skeleton overlay**, converts posture into a **score**, and tracks how long each player stays in the **green zone**. A tiny **Node/Express + Socket.IO** backend hosts game sessions and a live leaderboard.

---

## Features

- ✅ **Chrome Extension UI** (Create / Join / Lobby / Session / Leaderboard)
- ✅ **Real-time body keypoints** → **skeleton overlay**
- ✅ **Posture score** + “green zone” time tracking
- ✅ **Multiplayer sessions** (up to 4 players) via **Socket.IO**
- ✅ **Host-controlled timer** (5/10/15/30 minutes)
- ✅ Server picks the **winner by longest green-zone time**

---

## Tech Stack

- **Frontend (Extension):**
  - Vanilla JS (ESM)
  - `@eyepop.ai/eyepop` + `@eyepop.ai/eyepop-render-2d`
  - `socket.io-client`

- **Backend:**
  - Node.js + Express
  - Socket.IO
  - EyePop SDK session minting endpoint

---

## Repo Structure (suggested)

> Your exact folders may vary — this is the typical layout.

