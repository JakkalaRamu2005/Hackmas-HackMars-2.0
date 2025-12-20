# 🎅 Grinch Mode - Distraction Blocker

## Overview
Grinch Mode is a productivity feature that helps students stay focused during study sessions by blocking distracting websites and implementing Pomodoro-style study timers.

## Features

### 1. **Pomodoro Timer**
- Customizable study duration (default: 25 minutes)
- Customizable break duration (default: 5 minutes)
- Visual circular progress indicator
- Session counter to track completed study sessions
- Christmas bell sound notification when sessions complete

### 2. **Website Blocker**
- Block distracting websites during study sessions
- Pre-configured list of common distractions (Facebook, Twitter, Instagram, YouTube, Reddit, TikTok, Netflix, Twitch)
- Add custom websites to block
- Remove websites from blocklist
- Full-screen Grinch-themed block page when accessing blocked sites

### 3. **Settings**
- Adjust study and break durations
- Toggle Christmas bell sounds on/off
- Manage blocked websites list
- All settings persist in localStorage

## How to Use

### Starting a Study Session
1. Navigate to your Study Advent Calendar
2. Find the "🎅 Grinch Mode" timer in the sidebar
3. Click "Start" to begin your study session
4. The timer will count down from your configured study duration
5. When the timer reaches 0, you'll hear a Christmas bell and automatically switch to break time

### Configuring Settings
1. Click the ⚙️ (Settings) icon in the Grinch Mode card
2. Adjust study duration (1-120 minutes)
3. Adjust break duration (1-30 minutes)
4. Toggle Christmas bell sound
5. Add or remove blocked websites
6. Click "Save Settings"

### Managing Blocked Websites
1. Open Grinch Mode settings
2. In the "Blocked Websites" section, type a domain (e.g., "facebook.com")
3. Click "Add" or press Enter
4. To remove a website, click the ✕ next to it
5. Save your settings

### What Happens When You Visit a Blocked Site
- If Grinch Mode is enabled and you try to visit a blocked website
- You'll see a full-screen Grinch-themed block page
- Options:
  - "Go Back to Studying" - Returns to previous page
  - "Disable Grinch Mode" - Temporarily disables blocking (not recommended!)

## Technical Details

### Storage
- Settings stored in `localStorage` under key: `grinch_mode_settings`
- Session data stored in `localStorage` under key: `grinch_mode_session`
- Persists across browser sessions

### Components
- **GrinchModeTimer** - Main timer component with circular progress
- **GrinchModeSettings** - Settings modal for configuration
- **GrinchBlocker** - Full-screen block page (optional, for browser extension)

### Integration with Gamification
- Completing study sessions can award bonus points
- Session count tracked separately from task completion
- Can be integrated with streak system

## Future Enhancements
- Browser extension for true website blocking
- Integration with calendar tasks (auto-start timer when opening a task)
- Study time analytics and reports
- Leaderboard for most study sessions completed
- Custom Grinch animations and themes
- Mobile app support with notification reminders

## Christmas Theme Elements
- 🎅 Grinch character as the "distraction blocker"
- 🔔 Christmas bell sounds for session completion
- ❄️ Snowflake animations on block page
- 🎄 Christmas color scheme (red, green, gold)
- Festive messaging and UI elements

---

**Note**: The website blocking feature works within the app context. For full browser-level blocking, a browser extension would be needed.
