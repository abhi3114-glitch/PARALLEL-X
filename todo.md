# Parallel Life Universe - MVP Development Plan

## Overview
Building a self-evolution simulator with Next.js-like architecture using React Router, comparing real decisions vs AI alternate self across 6 dimensions.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Supabase (backend, auth, database)
- React Query for data fetching
- Framer Motion for animations
- Recharts for data visualization

## MVP Features (Simplified for Demo)
1. ✅ Auth & Onboarding (mock auth for demo)
2. ✅ Decision Logging (real timeline)
3. ✅ Alternate Self Simulation (rule-based)
4. ✅ Comparison Dashboard (charts & metrics)
5. ✅ Reality Sync Tasks
6. ✅ Streaks & Badges
7. ✅ Weekly Leaderboard

## File Structure (8 files max - HARD LIMIT)

### Core Files
1. **src/pages/Index.tsx** - Main dashboard with comparison view
2. **src/pages/LogDecision.tsx** - Decision logging form
3. **src/pages/SyncTasks.tsx** - Reality sync task management
4. **src/pages/Profile.tsx** - User profile & settings
5. **src/lib/simulation.ts** - Simulation engine & policy matrix
6. **src/lib/supabase.ts** - Supabase client setup
7. **src/components/DashboardLayout.tsx** - Shared layout with nav
8. **src/App.tsx** - Update routing

### Implementation Strategy
- Use localStorage for demo data persistence (Supabase integration ready)
- Simplified simulation engine with deterministic rules
- Mobile-first responsive design
- Dark theme with glassmorphism
- Minimal but functional MVP

## Dimension Mapping
- Health (strength)
- Skills (intelligence) 
- Discipline
- Social
- Finance
- Mood

## Policy Matrix (Simplified)
```
workout: health +3, discipline +2, mood +1
study: skills +4, discipline +1
sleep_extra: health +2, mood +1
social_event: social +3, mood +2
save_money: finance +2, discipline +1
scroll_phone: discipline -2, mood -1
skip_workout: health -2, discipline -1
```

## Development Order
1. Setup Supabase client & types
2. Create simulation engine with policy matrix
3. Build DashboardLayout with navigation
4. Implement LogDecision page
5. Build Index dashboard with comparison charts
6. Create SyncTasks page
7. Add Profile page with streaks
8. Update App.tsx routing