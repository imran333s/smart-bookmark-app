
# Smart Bookmark App

## Overview
A real-time bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**. Users can authenticate via Google, add/delete bookmarks, and see updates instantly across devices.

## Features
- **Google Authentication:** Secure login with Supabase Auth.
- **Real-Time Sync:** WebSockets via Supabase Realtime update the UI instantly.
- **Row Level Security (RLS):** Data is strictly private to each user.
- **Responsive UI:** Glassmorphism design and smooth animations with Framer Motion.

## Setup Instructions

1. **Clone Repo:**
   ```bash
   git clone <repo_url>
   cd smart-bookmark-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *Required packages:* `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.

3. **Configure Environment Variables:**
   - Create a `.env.local` file in the root.
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

4. **Database Setup:**
   - Run the SQL commands in `schema.sql` in your Supabase SQL Editor to create the `bookmarks` table and enable RLS policies.

5. **Run Locally:**
   ```bash
   npm run dev
   ```

## Design Decisions & Challenges

### 1. Real-Time Sync & RLS "Sticky" Updates
**Challenge:** While `DELETE` events synced instantly, `INSERT` events (Adding) were initially inconsistent across different tabs. This is a common issue with Supabase Realtime when Row Level Security (RLS) is enabled, as the server must check if the subscriber has `SELECT` access to the new row before broadcasting.
**Solution:** Refactored the real-time logic to use a **Universal Catch-All Listener (`*`)** and implemented a **Fallback Refresh mechanism**. The app now detects any database change and immediately re-fetches the latest state from the database. This ensures 100% sync reliability regardless of RLS filtering delays.

### 2. Next.js Middleware & Auth State Consistency
**Challenge:** Keeping unauthorized users out of the dashboard while preventing "Redirect Loops" during the Google OAuth callback.
**Solution:** Implemented a robust middleware using `@supabase/ssr` that checks for active session cookies and handles route protection. I specifically exempted the `/auth/callback` route and `images/static` assets to ensure a smooth login flow.

### 3. Modern Glassmorphism Aesthetic
**Challenge:** Creating a premium, "enterprise-grade" feel while keeping the code simple.
**Solution:** Leveraged **Tailwind CSS v4**'s advanced transparency and backdrop-blur utilities. I used a dark slate palette (`#0f172a`) combined with purple/blue gradients and **Framer Motion** for subtle entrance animations, making the app feel alive and responsive.

## Requirements Checklist ✅
- [x] Google OAuth Login (via Supabase)
- [x] Add Bookmarks (Title + URL)
- [x] Delete Bookmarks
- [x] Real-time Sync (Multi-tab support)
- [x] Private Data (RLS Protected)
- [x] Responsive & Premium Design

## Submission Links
- **GitHub Repository:** [Insert Link Here]
- **Live Demo (Vercel):** [Insert Link Here]
