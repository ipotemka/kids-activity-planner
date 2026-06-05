# Family Summer Activity Planner

A shared family calendar for managing kids' summer activities, camps, transportation, and tasks — June 22 to July 20, 2025.

**Children:** Venya (blue) · Sasha (purple) · Gavr (green)

## Features

- 📅 Full calendar view, June 22 – July 20, grouped by week
- 🎨 Color-coded per child with weekend highlighting
- 🏕️ Three daily slots: Daytime/Camp · After-Camp · Evening
- 🚗 Drop-off & pick-up tracking per activity
- ✅ Shared family task checklist with progress bar
- 🔍 Filter by child + full-text search
- ⚡ Real-time sync across all family members (Supabase Realtime)
- 📱 Mobile-responsive layout
- 🔐 Authentication — each family member has their own account

---

## Deploy to Railway (no Node.js needed locally)

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a free account → **New project**
2. Wait ~2 min for the project to provision
3. In the dashboard → **SQL Editor** → **New query** → paste and run the contents of [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql)
4. In **Database → Replication** → enable **Realtime** for the `events` and `tasks` tables
5. In **Settings → API**, copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key

### Step 2 — Push this repo to GitHub

Open **Terminal** on your Mac and run:

```bash
cd /Users/ipotemka/kids-activity-planner
git init
git add .
git commit -m "Initial commit — Family Summer Planner"
```

Then create the GitHub repo and push:

```bash
# Option A — GitHub CLI (if you have it)
gh repo create kids-activity-planner --public --source=. --push

# Option B — manual (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kids-activity-planner.git
git branch -M main
git push -u origin main
```

> **No GitHub CLI?** Go to [github.com/new](https://github.com/new), create a repo named `kids-activity-planner`, then follow the "push an existing repo" instructions GitHub shows you.

### Step 3 — Deploy on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `kids-activity-planner`
3. Railway auto-detects Next.js — click **Deploy**
4. Go to **Variables** tab and add:

```
NEXT_PUBLIC_SUPABASE_URL      = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

5. Railway redeploys automatically — your app is live in ~2 minutes
6. Go to **Settings → Networking → Generate Domain** to get a public URL

### Step 4 — Create family accounts

1. Open your Railway URL
2. Click **Sign up** — create accounts for each family member
3. Share the URL with your family — everyone signs up with their own email/password

---

## Local development (requires Node.js 18+)

```bash
cp .env.example .env.local
# fill in your Supabase keys in .env.local

npm install
npm run dev
# open http://localhost:3000
```

---

## Project structure

```
app/
  layout.tsx          Root layout
  page.tsx            Home (server component, auth guard)
  login/page.tsx      Sign in / sign up
  api/auth/callback/  OAuth callback handler
components/
  PlannerClient.tsx   Main app shell (client, realtime)
  DayCard.tsx         Per-day calendar card
  ActivityCard.tsx    Individual activity card
  EventModal.tsx      Add / edit activity modal
  TaskPanel.tsx       Family task checklist
  FilterBar.tsx       Child filter + search
  PlanningPanel.tsx   Notes & transport roster
lib/
  types.ts            TypeScript types + constants
  dates.ts            Date range helpers
  supabase/           Browser / server / middleware clients
supabase/
  migrations/001_initial.sql   Full DB schema + seed data
```

---

## Database schema

| Table | Key columns |
|---|---|
| `profiles` | id, name, email, role |
| `events` | child, title, start_date, end_date, start_time, end_time, location, drop_off, pick_up, notes, type, slot, created_by, updated_by |
| `tasks` | title, completed, created_by, updated_by |

All tables have `created_at` / `updated_at` timestamps and full audit trail.

Deployment update
