
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

### 1. Real-Time Updates with RLS
**Challenge:** Initially, realtime subscriptions block updates if RLS policies are too restrictive or if the client doesn't properly authenticate the socket connection.
**Solution:** Used `supabase-js` client-side subscription which automatically handles the auth token for WebSocket connections. Ensured RLS policies allow `select` for `auth.uid() = user_id`.

### 2. Next.js Middleware & Auth State
**Challenge:** Keeping the unauthorized users out of protected routes while allowing the auth callback to process.
**Solution:** Implemented a robust middleware that checks for the session and redirects unauthenticated users to `/login`, while exempting `/auth/*` routes to break redirect loops.

### 3. Tailwind v4 & Glassmorphism
**Challenge:** Implementing complex glassmorphism effects consistently.
**Solution:** Abstracted styles into `.glass-card` utility classes in `globals.css` and used Tailwind's arbitrary values for precise color opacity control (`bg-slate-900/50`).
