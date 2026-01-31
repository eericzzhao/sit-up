# Session Duration Update Summary

## ✅ Changes Implemented

Your PosturePal multiplayer backend now supports flexible session durations with a smart UI:

### 🕐 Duration Options

#### Quick Select (Dropdown)

- **1 minute** - Testing mode
- **15 minutes** - Quick game (default)
- **30 minutes** - Medium session
- **45 minutes** - Longer game
- **60 minutes** - 1 hour session
- **Custom** - Opens text input for 60+ minutes

#### Custom Duration Input

- Appears when "Custom duration (60+ minutes)" is selected
- Accepts any value from **60 to 480 minutes** (8 hours max)
- Input validation prevents values below 60 or above 480

### 🎯 How It Works

**Frontend (demo.html)**

```javascript
// User selects from dropdown
<select id="duration" onchange="handleDurationChange()">
  <option value="15">15 minutes</option>
  <option value="30">30 minutes</option>
  <option value="45">45 minutes</option>
  <option value="60">60 minutes</option>
  <option value="custom">Custom duration (60+ minutes)</option>
</select>

// Custom input field (hidden by default)
<input type="number" id="custom-duration" min="60" />

// JavaScript validation
if (durationSelect === 'custom') {
  if (customDuration < 60) {
    error: 'Please enter 60 minutes or more'
  }
  if (customDuration > 480) {
    error: 'Maximum 8 hours (480 minutes)'
  }
}
```

**Backend (routes/session.js)**

```javascript
// Server-side validation
POST /api/session/create
{
  "duration": 120  // any value 1-480
}

// Validates:
- Must be a number
- Minimum: 1 minute
- Maximum: 480 minutes (8 hours)
```

### 📋 Validation Rules

| Rule             | Value       | Error Message                               |
| ---------------- | ----------- | ------------------------------------------- |
| Minimum          | 1 minute    | "Duration must be a positive number"        |
| Custom threshold | 60 minutes  | "Please enter 60 minutes or more"           |
| Maximum          | 480 minutes | "Maximum duration is 8 hours (480 minutes)" |
| Type             | Number      | "Duration must be a positive number"        |

### 🎨 User Experience Flow

1. **User creates game**
   - Sees dropdown with preset options (15, 30, 45, 60 min)
2. **Wants longer session?**
   - Selects "Custom duration (60+ minutes)"
   - Input field appears with helpful hint
3. **Enters custom time**
   - Types any number ≥ 60 (e.g., 90, 120, 180)
   - Gets immediate feedback if invalid
4. **Creates session**
   - Backend validates and creates session
   - Timer shows correct duration

### 💡 Example Use Cases

```javascript
// 15-minute quick game (default)
createSession(userId, "Player1", 15);

// 30-minute workout session
createSession(userId, "Player1", 30);

// 90-minute study session (custom)
createSession(userId, "Player1", 90);

// 3-hour marathon (180 minutes)
createSession(userId, "Player1", 180);

// Max 8-hour session
createSession(userId, "Player1", 480);
```

### 🔧 Files Modified

1. **demo.html**
   - Updated dropdown with 15-min intervals
   - Added custom duration input field
   - Added `handleDurationChange()` function
   - Enhanced `createSession()` with validation

2. **backend/routes/session.js**
   - Added duration validation (1-480 minutes)
   - Added type checking
   - Added helpful error messages

3. **frontend/integration-guide.js**
   - Updated documentation
   - Added duration guidelines

4. **backend/README.md**
   - Documented duration options
   - Added validation rules

### 🚀 Testing

**Test the new duration options:**

1. Open `demo.html` in your browser
2. Try creating sessions with:
   - ✅ 15 minutes (preset)
   - ✅ 30 minutes (preset)
   - ✅ 45 minutes (preset)
   - ✅ 60 minutes (preset)
   - ✅ Custom: 90 minutes
   - ✅ Custom: 120 minutes (2 hours)
   - ❌ Custom: 30 (should error - below 60)
   - ❌ Custom: 500 (should error - above 480)

### 📱 Chrome Extension Integration

Update your extension's session creation UI:

```html
<!-- Duration selector -->
<select id="duration-select">
  <option value="15">15 minutes</option>
  <option value="30">30 minutes</option>
  <option value="45">45 minutes</option>
  <option value="60">1 hour</option>
  <option value="custom">Custom (60+ min)</option>
</select>

<!-- Custom input (show/hide based on selection) -->
<input
  type="number"
  id="custom-duration"
  placeholder="Enter minutes (60-480)"
  min="60"
  max="480"
  style="display: none;"
/>
```

```javascript
// Handle selection change
document.getElementById("duration-select").addEventListener("change", (e) => {
  const customInput = document.getElementById("custom-duration");
  if (e.target.value === "custom") {
    customInput.style.display = "block";
  } else {
    customInput.style.display = "none";
  }
});
```

### 🎯 Summary

✅ **15-minute intervals** up to 60 minutes  
✅ **Custom text input** for 60+ minutes  
✅ **Maximum 8 hours** (480 minutes)  
✅ **Client & server validation**  
✅ **User-friendly error messages**  
✅ **Works in demo.html** right now!

Your multiplayer posture game now supports flexible session lengths from quick 15-minute games to marathon 8-hour study sessions! 🎮
