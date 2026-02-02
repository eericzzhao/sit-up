# sit-up - Posture Competition Chrome Extension 

computer vision eyepop posture game for the SanD Hacks hackathon

**SitUp** is a Chrome extension that turns “good posture” into a lightweight multiplayer competition. It uses **EyePop** to detect body keypoints, draws a live **skeleton overlay**, converts posture into a **score**, and tracks how long each player stays in the **green zone** meaning you have good posture. We want something something simple that hopefully encourages people to correct their sitting posture in a time where we spend so much of our life just sitting around. 

---

## Features

- **Chrome Extension UI** 
- **Real-time body keypoints** → **skeleton overlay**
- **Posture score** + “green zone” time tracking
- **Multiplayer sessions** (up to 4 players) 
- **Host settings i.e. timers** (5/10/15/30 minutes)
- Server picks the **winner by longest green-zone time**

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


