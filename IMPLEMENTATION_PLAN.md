# StudyAdvent.ai - Implementation Plan

## 🎄 Project Goal
Build "StudyAdvent.ai" - A web application that transforming boring exam syllabuses and deadlines into a festive, gamified Advent Calendar.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Icons**: Lucide React
- **AI**: OpenAI (GPT-4o or 3.5-turbo) or Gemini API
- **Persistence**: LocalStorage (MVP) / Convex (Optional for multi-device)

## 📅 Roadmap

### Phase 1: Foundation & "Christmas UI" System (Day 1)
- [ ] Install dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`).
- [ ] configurations for fonts (Google Fonts: "Mountains of Christmas" for headers, "Inter" for body).
- [ ] Define Tailwind Color Palette (Deep Reds, Forest Greens, Snow Whites, Gold).
- [ ] Create basic Layout with falling snow background.

### Phase 2: Core Features (The "Magic") (Day 2-3)
- [ ] **Syllabus Input**: Text area / File upload for syllabus.
- [ ] **AI Generator**: Server Action to prompt AI: "Turn this study plan into 24 advent tasks".
- [ ] **Advent Grid**: Responsive CSS Grid component.
- [ ] **Door Animation**: Framer Motion 3D flip effect + particle explosion on open.

### Phase 3: Gamification (Day 4)
- [ ] **Virtual Tree**: A 3D-ish tree component (SVG/CSS).
- [ ] **Ornament System**: When task is marked "Done", add an ornament to the tree.
- [ ] **Sound Effects**: Jingle bells on success.

### Phase 4: Polish & Demo Prep (Day 5)
- [ ] "Grinch Mode" (Focus timer / distraction blocker).
- [ ] Empty States / Loading States (Festive animations).
- [ ] Demo Video Recording.

## 📂 Key File Structure
```
src/
├── app/
│   ├── layout.tsx       # Global snow effect wrapper
│   ├── page.tsx         # Landing + Calendar View
│   ├── api/             # AI generation endpoints
│   └── globals.css      # Custom animations
├── components/
│   ├── calendar/
│   │   ├── AdventGrid.tsx
│   │   └── DayDoor.tsx  # The interactive door
│   ├── gamification/
│   │   ├── Tree.tsx     # The visual progress bar
│   │   └── Ornament.tsx
│   └── ui/              # Reusable atoms
├── lib/
│   ├── ai.ts            # AI prompt logic
│   └── store.ts         # State management
└── types/
    └── advent.ts        # TS Interfaces
```
