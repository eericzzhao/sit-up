# PosturePal Multiplayer Backend 🎮

Real-time multiplayer posture competition backend with WebSocket support.

## Features

- 🎯 **Multiplayer Sessions**: Create and join competitive posture sessions
- ⏱️ **Timed Competitions**: Default 15-minute sessions
- 🏆 **Live Leaderboards**: Real-time score updates
- 📊 **Smart Scoring**: Gain points for good posture, lose points for bad posture
- 🔌 **WebSocket Support**: Real-time bidirectional communication
- 👥 **Up to 10 Players**: Compete with friends simultaneously

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Add your EyePop.ai credentials:

```env
EYEPOP_POP_ID=your_pop_id
EYEPOP_SECRET_KEY=your_secret_key
```

## Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Session Management

#### Create Session

```http
POST /api/session/create
Content-Type: application/json

{
  "userId": "user123",
  "username": "JohnDoe",
  "duration": 15  // in minutes
}
```

**Duration Options:**

- **Recommended intervals**: 15, 30, 45, 60 minutes
- **Custom duration**: Any value from 60 to 480 minutes (8 hours max)
- **Testing**: Use 1 minute for quick tests
- **Validation**: Duration must be between 1-480 minutes

#### Join Session

```http
POST /api/session/join
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "userId": "user456",
  "username": "JaneDoe"
}
```

#### Start Session (Host Only)

```http
POST /api/session/start
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "userId": "user123"
}
```

#### Get Session Info

```http
GET /api/session/:sessionId
```

#### Get Leaderboard

```http
GET /api/session/:sessionId/leaderboard
```

#### Leave Session

```http
POST /api/session/leave
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "userId": "user123"
}
```

### Posture Analysis (Existing)

```http
POST /api/analyze
Content-Type: application/json

{
  "image": "base64_encoded_image"
}
```

## WebSocket Protocol

### Connect

```javascript
const ws = new WebSocket("ws://localhost:3000");
```

### Register to Session

```javascript
ws.send(
  JSON.stringify({
    type: "register",
    payload: {
      userId: "user123",
      sessionId: "uuid-here",
    },
  }),
);
```

### Send Posture Update

```javascript
ws.send(
  JSON.stringify({
    type: "posture_update",
    payload: {
      sessionId: "uuid-here",
      userId: "user123",
      imageData: "base64_encoded_image",
    },
  }),
);
```

### Receive Messages

#### Registration Confirmation

```json
{
  "type": "registered",
  "payload": {
    "userId": "user123",
    "sessionId": "uuid-here",
    "session": {
      /* session data */
    }
  }
}
```

#### Posture Feedback

```json
{
  "type": "posture_feedback",
  "payload": {
    "score": 85,
    "isGoodPosture": true,
    "issues": [],
    "currentScore": 1250
  }
}
```

#### Leaderboard Update

```json
{
  "type": "leaderboard_update",
  "payload": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "user123",
        "username": "JohnDoe",
        "score": 1250,
        "connected": true
      }
    ]
  }
}
```

#### Player Events

```json
{
  "type": "player_joined",
  "payload": {
    "userId": "user456",
    "players": [
      /* all players */
    ]
  }
}
```

```json
{
  "type": "player_disconnected",
  "payload": {
    "userId": "user456"
  }
}
```

## Scoring System

### Good Posture

- **+2 points per second** in good posture
- Tracks total time with good posture

### Bad Posture

- **-3 points per second** in bad posture
- Score cannot go below 0
- Tracks total time with bad posture

### Winning

- Highest score after 15 minutes wins
- Final rankings show:
  - Total score
  - Good posture time
  - Bad posture time
  - Accuracy percentage

## Session Flow

1. **Create**: Host creates session
2. **Wait**: Players join using session ID
3. **Start**: Host starts when ready (min 2 players)
4. **Compete**: 15-minute competition with live updates
5. **End**: Auto-ends after duration, shows final rankings

## Architecture

```
backend/
├── index.js                 # Main server with HTTP + WebSocket
├── routes/
│   ├── analyze.js          # Posture analysis endpoints
│   └── session.js          # Session management endpoints
├── services/
│   ├── eyepop.js           # EyePop.ai integration
│   ├── normalize.js        # Posture scoring logic
│   ├── sessionManager.js   # Session state management
│   └── websocket.js        # WebSocket server & handlers
└── utils/
    ├── cors.js             # CORS configuration
    └── rateLimit.js        # Rate limiting
```

## Development Tips

- Sessions auto-cleanup after 1 hour (waiting) or 24 hours (completed)
- Max 10 players per session
- WebSocket reconnection should be handled client-side
- Use session ID to rejoin if disconnected

## Testing

Test the server with:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-31T..."
}
```
