# PosturePal Multiplayer System Overview

## 🎮 How It Works

### Scoring System

- **Good Posture**: +2 points per second
- **Bad Posture**: -3 points per second (never below 0)
- **Winner**: Highest score after 15 minutes

### Session Flow

```
1. CREATE SESSION
   Alice creates → Gets session ID → Becomes host

2. INVITE FRIENDS
   Alice shares session ID
   Bob joins using ID
   Charlie joins using ID
   [2-10 players total]

3. START COMPETITION
   Host clicks "Start"
   15-minute timer begins
   Everyone's webcam activates

4. LIVE COMPETITION
   ┌─────────────────────────┐
   │  LEADERBOARD (LIVE)     │
   │  1. Alice     1,250 pts │
   │  2. Bob         980 pts │
   │  3. Charlie     750 pts │
   └─────────────────────────┘

   Every 2 seconds:
   - Capture webcam frame
   - AI analyzes posture
   - Update score in real-time
   - Broadcast to all players

5. END & RESULTS
   After 15 minutes:
   - Final rankings displayed
   - Stats shown:
     * Total score
     * Good posture time
     * Bad posture time
     * Accuracy %
```

## 🏗️ Architecture

```
┌─────────────────┐
│ Chrome Extension│ (Your Frontend)
│  - Webcam       │
│  - UI           │
│  - WebSocket    │
└────────┬────────┘
         │
         │ ws:// + http://
         │
┌────────▼────────┐
│  Backend Server │
│  Port 3000      │
│  ├─ HTTP API    │ Session management
│  └─ WebSocket   │ Real-time updates
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│EyePop │ │Session│
│  AI   │ │Manager│
└───────┘ └───────┘
```

## 📡 Data Flow

### Creating & Joining

```
Extension → HTTP POST /api/session/create
         ← Returns: sessionId

Extension → HTTP POST /api/session/join
         ← Returns: session details

Extension → WebSocket: register message
         ← Confirmation + session state
```

### During Competition

```
[Every 2 seconds]
Extension: Capture webcam frame
        ↓
Extension → WebSocket: posture_update
        ↓              (base64 image)
    Backend: Analyze with EyePop AI
        ↓
    Backend: Calculate score
        ↓
    Backend → All Players: leaderboard_update
        ↓
Extensions: Update UI with new scores
```

## 🎯 Key Features

### Session Management

- **Create**: Host creates 15-min session
- **Join**: Players join with session ID
- **Start**: Host starts when ready (min 2 players)
- **Auto-end**: Automatically ends after time
- **Leave**: Players can leave anytime

### Real-time Updates

- Live leaderboard (updates every 2s)
- Player join/leave notifications
- Connection status indicators
- Instant score changes

### Scoring Intelligence

- Shoulder alignment
- Neck angle
- Spine position
- Real-time feedback

### Session Limits

- Max 10 players per session
- 15-minute duration (configurable)
- Auto-cleanup old sessions

## 📊 Message Types

### Client → Server

```javascript
// Register to session
{ type: 'register', payload: { userId, sessionId } }

// Send posture data
{ type: 'posture_update', payload: { sessionId, userId, imageData } }

// Request leaderboard
{ type: 'session_update', payload: { sessionId, action: 'request_leaderboard' } }
```

### Server → Client

```javascript
// Registration confirmed
{ type: 'registered', payload: { userId, sessionId, session } }

// Posture analysis result
{ type: 'posture_feedback', payload: { score, isGoodPosture, currentScore } }

// Leaderboard updated
{ type: 'leaderboard_update', payload: { leaderboard: [...] } }

// Player joined
{ type: 'player_joined', payload: { userId, players: [...] } }

// Player left
{ type: 'player_disconnected', payload: { userId } }

// Error occurred
{ type: 'error', payload: { error: 'message' } }
```

## 🚀 Quick Start Guide

### Backend Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your EyePop.ai credentials

# 3. Start server
npm start

# Server runs on:
# HTTP: http://localhost:3000
# WebSocket: ws://localhost:3000
```

### Frontend Integration

```javascript
// 1. Create client
const client = new PosturePalClient();
client.connect("ws://localhost:3000");

// 2. Create session
const result = await createSession(userId, username, 15);
const sessionId = result.sessionId;

// 3. Register WebSocket
client.registerToSession(userId, sessionId);

// 4. Share session ID with friends
shareLink = `posturepal://join/${sessionId}`;

// 5. Start when ready
await startSession(sessionId, userId);

// 6. Send frames
setInterval(() => {
  const frame = captureWebcam();
  client.sendPostureUpdate(frame);
}, 2000);
```

## 💡 Tips for Frontend Development

1. **User ID Generation**

   ```javascript
   const userId = crypto.randomUUID();
   localStorage.setItem("posturePalUserId", userId);
   ```

2. **Session ID Sharing**
   - Show QR code
   - Copy to clipboard
   - Generate share link
   - Email invitation

3. **UI States**
   - Waiting for players
   - Session starting (3, 2, 1...)
   - Active competition
   - Session ended

4. **Error Handling**
   - Webcam permission denied
   - Network disconnection
   - Session not found
   - Host left

5. **Performance**
   - Send frames every 2-3 seconds
   - Compress images (JPEG quality 0.8)
   - Debounce rapid updates
   - Cache leaderboard data

## 🐛 Testing

```bash
# Start server
npm start

# In another terminal, run test
node backend/test-multiplayer.js

# Expected output:
# ✅ Session created
# ✅ Bob joined
# ✅ WebSockets connected
# ✅ Session started
# 🏆 Leaderboard displayed
```

## 🔐 Security Considerations

- Rate limiting (100 req/15min per IP)
- Image size limit (10MB)
- Max 10 players per session
- Session auto-cleanup
- CORS configuration

## 📱 Next Steps for Chrome Extension

1. **Create Session UI**
   - "Create Game" button
   - Username input
   - Duration selector (5, 10, 15 min)

2. **Join Session UI**
   - "Join Game" button
   - Session ID input
   - Username input

3. **Lobby UI**
   - Player list
   - "Start Game" button (host only)
   - "Leave" button

4. **Game UI**
   - Live webcam preview
   - Current score (big!)
   - Leaderboard (side panel)
   - Timer countdown
   - Posture status indicator

5. **Results UI**
   - Final rankings
   - Personal stats
   - "Play Again" button
   - Share results

Happy coding! 🚀
