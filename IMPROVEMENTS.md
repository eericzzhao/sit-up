# Game Improvements: Side Detection & Persistence

## Overview
Two major features have been added to make the sit-up game more robust and user-friendly:

1. **Side Angle Detection** - The app now works even when users turn to their side
2. **Game State Persistence** - Games automatically resume if the extension tab is closed and reopened

---

## 1. Side Angle Detection

### How It Works
- **View Orientation Detection**: The app continuously checks if the user is facing front or turned to the side
  - Analyzes shoulder confidence levels (left vs right)
  - Analyzes eye/ear visibility imbalance
  - If imbalance > 0.35 for shoulders or > 0.4 for eyes, orientation is marked as "side"

- **Side-View Scoring**: When turned to the side, different keypoint combinations are used
  - Uses the more visible shoulder/hip pair (left or right)
  - Focuses on vertical spine alignment (key indicator in side view)
  - Penalizes forward head lean and slouching
  - Adjusts response sensitivity for better real-time feedback

### Benefits
✅ Users can work out at any angle  
✅ More forgiving posture detection  
✅ Handles natural body rotation during sit-ups  

### Technical Implementation
- Added `detectViewOrientation()` - detects front vs side view
- Added `scoreFromSideView()` - calculates posture score for side angles
- Modified `scoreFromKeypoints()` - routes to side-view scoring when appropriate

---

## 2. Game State Persistence

### How It Works
- **Auto-Save**: When a game session starts, the session data is saved to browser's localStorage
- **Auto-Resume**: When the extension reopens, it checks for any persisted session
- **Seamless Rejoin**: The app automatically reconnects to the session server

### Data Persisted
```javascript
{
  sessionId: "123456",
  duration: 900,
  playerName: "Alice",
  playerId: "player_1",
  isHost: false,
  sessionStartTime: 1675234567890
}
```

### Benefits
✅ Won't lose game progress if browser crashes  
✅ Can close extension tab and resume later  
✅ Seamless reconnection without re-entering session code  
✅ Player stats and score preserved  

### Technical Implementation
**Frontend (popup.js)**:
- `persistSessionState()` - Saves session to localStorage when game starts
- `clearSessionState()` - Clears data when game ends
- `resumePersistedSession()` - Checks for existing session on app load
- Called on `DOMContentLoaded` to restore sessions

**Backend (handlers.js)**:
- `rejoin_session` - New socket event handler for reconnecting players
- Allows rejoining only if session is still active

**Session Model (Session.js)**:
- Enhanced `addPlayer()` to accept optional `customPlayerName`
- Added logic to detect returning players

---

## Testing Checklist
- [ ] Turn to your side during a sit-up - score should still update
- [ ] Start a game and close the browser tab - reopen and it should rejoin
- [ ] Multiple angle changes during one session - should track smoothly
- [ ] Session persistence after network disconnect - should resume on reconnect

---

## Files Modified
- `/frontend/popup.js` - Added side detection & persistence logic
- `/backend2/sockets/handlers.js` - Added rejoin_session event
- `/backend2/models/Session.js` - Enhanced player management

---

## Future Enhancements
- Store full game stats (running score, timestamps) in localStorage
- Persist game state across browser sessions (even after closing completely)
- Add automatic position correction hints for side view
- Save replay data for post-game analysis
