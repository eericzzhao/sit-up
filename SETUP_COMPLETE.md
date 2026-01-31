# 🎮 PosturePal Multiplayer Backend - Setup Complete!

## ✅ What's Been Built

Your PosturePal backend is now a **full multiplayer competitive posture game system**! Here's what you have:

### 🏗️ Architecture

- ✅ **HTTP REST API** for session management
- ✅ **WebSocket server** for real-time updates
- ✅ **Session manager** with competitive scoring
- ✅ **EyePop.ai integration** for posture analysis
- ✅ **Rate limiting & CORS** for security

### 📁 File Structure

```
sit-up/
├── backend/
│   ├── index.js                    # Main server (HTTP + WebSocket)
│   ├── routes/
│   │   ├── analyze.js              # Posture analysis endpoints
│   │   └── session.js              # Session management API
│   ├── services/
│   │   ├── eyepop.js               # EyePop.ai posture detection
│   │   ├── normalize.js            # Scoring algorithm
│   │   ├── sessionManager.js       # Multiplayer session logic
│   │   └── websocket.js            # Real-time communication
│   ├── utils/
│   │   ├── cors.js                 # CORS configuration
│   │   └── rateLimit.js            # API rate limiting
│   ├── test-multiplayer.js         # Backend test script
│   └── README.md                   # Backend documentation
├── frontend/
│   ├── integration-guide.js        # Chrome extension guide
│   └── ... (your existing files)
├── demo.html                        # Interactive demo page
├── MULTIPLAYER_GUIDE.md            # Complete system overview
├── package.json                     # Dependencies + scripts
└── .env.example                     # Configuration template
```

## 🚀 Current Server Status

**✅ Server is RUNNING on:**

- HTTP API: `http://localhost:3000`
- WebSocket: `ws://localhost:3000`
- Health check: `http://localhost:3000/health`

## 🎯 How It Works

### 1. Create a Session (Host)

```bash
POST http://localhost:3000/api/session/create
{
  "userId": "user123",
  "username": "Alice",
  "duration": 15  # minutes
}
```

### 2. Join Session (Players)

```bash
POST http://localhost:3000/api/session/join
{
  "sessionId": "uuid-here",
  "userId": "user456",
  "username": "Bob"
}
```

### 3. Start Competition

```bash
POST http://localhost:3000/api/session/start
{
  "sessionId": "uuid-here",
  "userId": "user123"  # must be host
}
```

### 4. Real-time Updates (WebSocket)

```javascript
// Connect
ws = new WebSocket("ws://localhost:3000");

// Register to session
ws.send(
  JSON.stringify({
    type: "register",
    payload: { userId, sessionId },
  }),
);

// Send posture frame (every 2 seconds)
ws.send(
  JSON.stringify({
    type: "posture_update",
    payload: {
      sessionId,
      userId,
      imageData: "base64_image_here",
    },
  }),
);

// Receive updates
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  // msg.type: 'posture_feedback', 'leaderboard_update', etc.
};
```

## 🏆 Scoring System

- **Good Posture**: +2 points/second
- **Bad Posture**: -3 points/second (min: 0)
- **Winner**: Highest score after 15 minutes

### Posture Analysis

- Shoulder alignment
- Neck angle
- Spine position
- Real-time feedback

## 🧪 Testing

### Option 1: Demo HTML Page

```bash
# Server is already running!
# Just open in browser:
open demo.html

# Or serve it:
npx http-server -p 8080
# Then visit: http://localhost:8080/demo.html
```

### Option 2: Test Script

```bash
# In a new terminal:
node backend/test-multiplayer.js
```

### Option 3: Manual API Testing

```bash
# Create session
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"test1","username":"TestUser","duration":15}'

# Check health
curl http://localhost:3000/health
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# EyePop.ai (REQUIRED for posture analysis)
EYEPOP_POP_ID=your_pop_id_here
EYEPOP_SECRET_KEY=your_secret_key_here

# Session Settings
DEFAULT_SESSION_DURATION=15
MAX_PLAYERS_PER_SESSION=10

# Scoring
GOOD_POSTURE_POINTS_PER_SEC=2
BAD_POSTURE_PENALTY_PER_SEC=3
```

### Get EyePop.ai Credentials

1. Sign up at https://eyepop.ai
2. Create a new Pop
3. Get your Pop ID and Secret Key
4. Add to `.env`

## 📱 Chrome Extension Integration

Your Chrome extension needs to:

### 1. Session Management UI

- "Create Game" button → calls `/api/session/create`
- "Join Game" input → calls `/api/session/join`
- Display session ID for sharing

### 2. WebSocket Connection

```javascript
// Use the integration guide
const client = new PosturePalClient();
client.connect("ws://localhost:3000");
client.registerToSession(userId, sessionId);
```

### 3. Webcam Capture

```javascript
// Get webcam stream
const stream = await navigator.mediaDevices.getUserMedia({ video: true });

// Capture frames every 2 seconds
setInterval(() => {
  const imageData = captureFrame(video);
  client.sendPostureUpdate(imageData);
}, 2000);
```

### 4. UI Updates

- Live leaderboard
- Personal score display
- Timer countdown
- Player list
- Posture feedback

**See `frontend/integration-guide.js` for complete code examples!**

## 🎨 UI Screens Needed

1. **Home Screen**
   - Create Game
   - Join Game

2. **Lobby Screen**
   - Session ID (with copy button)
   - Player list
   - Start button (host only)
   - Leave button

3. **Game Screen**
   - Webcam preview
   - Current score (big!)
   - Live leaderboard
   - Timer
   - Posture status

4. **Results Screen**
   - Final rankings
   - Personal stats
   - Play Again button

## 📚 Documentation

- **Backend API**: `backend/README.md`
- **System Overview**: `MULTIPLAYER_GUIDE.md`
- **Integration Guide**: `frontend/integration-guide.js`
- **Demo**: `demo.html`

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart
npm start
```

### WebSocket connection fails

- Check firewall settings
- Verify server is running
- Check browser console for errors

### Posture analysis not working

- Add EyePop.ai credentials to `.env`
- Check image format (JPEG/PNG base64)
- Verify image size < 10MB

## 🚀 Next Steps

### For Chrome Extension:

1. ✅ Backend is ready!
2. ⬜ Build session management UI
3. ⬜ Implement WebSocket client
4. ⬜ Add webcam capture
5. ⬜ Create leaderboard display
6. ⬜ Style it beautifully!

### For Backend:

- ✅ Session management
- ✅ WebSocket communication
- ✅ Posture analysis
- ✅ Competitive scoring
- ⬜ Add user authentication (optional)
- ⬜ Add session history (optional)
- ⬜ Add achievements system (optional)

## 🎉 You're Ready!

Your multiplayer posture competition backend is **fully functional** and ready to connect with your Chrome extension!

**Quick Test:**

```bash
# Server is already running ✅
# Open demo.html in 2 browser tabs
# Create a game in tab 1
# Join with the session ID in tab 2
# Start the game and watch the leaderboard!
```

**Questions?**

- Check `MULTIPLAYER_GUIDE.md` for system overview
- Check `frontend/integration-guide.js` for code examples
- Check `backend/README.md` for API reference

Happy coding! 🚀
