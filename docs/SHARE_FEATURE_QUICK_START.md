# 🎁 Quick Start: Share Feature

## How to Use (For Users)

### 1. **Access the Share Feature**
- Complete some tasks in your advent calendar
- Look for the **"🎁 Share Progress"** button in the sidebar
- Click to open the share modal

### 2. **Share Options**

#### Download as Image
- Click **"Download as Image"** button
- High-quality PNG will be saved to your downloads
- Perfect for Instagram, Twitter, or printing!

#### Share to Social Media
Choose your platform:
- **Twitter** - Pre-formatted tweet with hashtags
- **LinkedIn** - Professional progress update
- **Facebook** - Share to your timeline
- **WhatsApp** - Send to friends/study groups

#### Copy Text
- Click **"Copy Progress Text"** 
- Paste anywhere you want!
- Includes all your stats and achievements

### 3. **What Gets Shared**

Your progress card includes:
- ✅ Completion percentage (e.g., 50% - 12/24 tasks)
- 🔥 Current streak (e.g., 5-day streak)
- ⭐ Total points earned
- ⏱️ Total study time
- 🏆 Achievements unlocked (with icons!)

## For Developers

### Quick Integration
```tsx
import { ShareModal } from '@/components/share/ShareModal';

// In your component
const [showShareModal, setShowShareModal] = useState(false);

// Render
<ShareModal
  isOpen={showShareModal}
  onClose={() => setShowShareModal(false)}
  completedCount={completedCount}
  totalTasks={24}
  gamificationStats={gamificationStats}
  analytics={analytics}
/>
```

### Trigger Button
```tsx
<button onClick={() => setShowShareModal(true)}>
  🎁 Share Progress
</button>
```

## Tips for Maximum Virality

### For Demo/Presentation:
1. **Complete 10-15 tasks** before sharing (looks impressive!)
2. **Build a streak** (3+ days shows commitment)
3. **Unlock achievements** (makes the card more colorful)
4. **Share during peak hours** (lunch time, evening)

### Best Practices:
- Share milestones (25%, 50%, 75%, 100%)
- Share when you unlock new achievements
- Share your streak when it hits 3, 7, 14, 30 days
- Add personal comments when sharing

### Hashtag Strategy:
Default hashtags included:
- #StudyAdvent
- #StudyMotivation
- #ChristmasStudying

Add your own:
- #ExamPrep
- #StudentLife
- #ProductivityHacks
- Your university/course hashtag

## Troubleshooting

### Download not working?
- Check browser permissions for downloads
- Try a different browser (Chrome/Edge recommended)
- Disable popup blockers

### Share button not appearing?
- Make sure you're on the calendar view
- Check if you have any tasks completed
- Refresh the page

### Image quality issues?
- The download uses 2x scale for high quality
- Image size is optimized for social media
- Works best on desktop browsers

## Examples of Great Shares

### Example 1: Milestone
"🎄 Just hit 50% on my StudyAdvent calendar! 12 tasks down, 12 to go! The gamification makes studying actually fun! 🔥"

### Example 2: Streak
"🔥 7-day study streak! StudyAdvent.ai is keeping me accountable through exam season. Who else is using it?"

### Example 3: Achievement
"🏆 Just unlocked the 'Week Warrior' achievement! StudyAdvent.ai makes exam prep feel like a game! #StudyMotivation"

---

**Remember**: Every share helps grow the community and motivates others! 🎄
