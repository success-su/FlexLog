# FlexLog (mobile)

A workout tracker built with Expo + Expo Router, NativeWind (Tailwind for React Native), and
Supabase (Auth + Postgres) so your logged sets sync to your account and follow you to any phone,
at any gym.

The previous web version (Vite + React + localStorage) has been moved to [`legacy-web/`](./legacy-web)
and is untouched — nothing was deleted.

## Folder structure

```
app/                      Expo Router — file-based routes
  _layout.jsx              Root: wraps providers, gates (tabs) vs (auth) on login state
  (auth)/                  Public routes — only reachable when signed out
    _layout.jsx
    index.jsx               Login screen
    signup.jsx               Sign up screen
  (tabs)/                  Protected routes — only reachable when signed in
    _layout.jsx              Tab bar (Log / History / Progress / Settings)
    index.jsx                 Log a set + stats + recent activity
    history.jsx
    progress.jsx
    settings.jsx

src/
  lib/                     Framework-free business logic (ported from the web app)
    supabase.js              Supabase client init (reads from .env)
    oneRepMax.js, dates.js, units.js
    authErrors.js
  context/                 App-wide state, kept separate from the UI
    AuthContext.jsx          Supabase auth session
    EntriesContext.jsx        Realtime-synced workout entries + edit state
    ToastContext.jsx          In-app toast notifications
  hooks/
    useEntries.js, useCountUp.js, usePersistedState.js
  components/              Shared, reusable UI pieces
    WorkoutForm, EntryRow, StatCard, OneRepMaxSummary, ConsistencyChart,
    PrimaryButton, ScreenContainer
```

Auth screens, protected app screens, business logic, and shared UI each live in their own
directory so the auth flow can be reasoned about independently from the logged-in app.

## One-time setup

### 1. Create a Supabase project

You'll need to do this yourself at [supabase.com](https://supabase.com/dashboard) — it requires
your own account, so it isn't something that can be scripted for you:

1. **New project** → pick an org, name it (e.g. `flexlog`), set a database password (save it
   somewhere — you won't need it day-to-day, but you'll want it if you ever connect a DB client
   directly), pick a region → **Create new project** (takes ~1-2 minutes to provision).
2. Once it's ready, open the **SQL Editor** (left sidebar) → **New query**, paste this, and run it:

   ```sql
   create table entries (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references auth.users(id) on delete cascade,
     exercise text not null,
     weight numeric not null,
     reps integer not null,
     unit text not null check (unit in ('lb', 'kg')),
     date text not null,
     created_at timestamptz not null default now()
   );

   alter table entries enable row level security;

   create policy "Users manage their own entries"
     on entries
     for all
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);

   alter publication supabase_realtime add table entries;
   ```

   This creates the table, turns on Row Level Security so users can only ever see their own rows,
   and enables realtime so the app updates live across devices.
3. *(Optional, recommended for quick testing)* **Authentication → Providers → Email** → turn off
   **Confirm email**. With it on, Supabase emails a confirmation link before a new signup can log
   in — fine for a real launch, mildly annoying while you're just testing on your own phone.
4. **Project Settings (gear icon) → Data API** → copy the **Project URL**.
5. **Project Settings → API Keys** → copy the **anon / public** key (not the `service_role` one —
   that one must never go in the app).

### 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the values from steps 1.4–1.5:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`.env` is gitignored, so your keys stay local. The anon key is safe to ship in the app — it's
meant to be public; Row Level Security (step 1.2) is what actually protects the data.

### 3. Install and run

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android) to run it on your phone. Sign up for an
account on your phone, then sign in with the same account on another device to see your sets sync.

## What's implemented

- Email/password sign up, login, logout (Supabase Auth), gated with Expo Router's
  `Stack.Protected`.
- Log a set, live estimated-1RM preview, per-exercise suggestions.
- History grouped by date, PR badges, edit/delete with undo, per-exercise filter chips.
- Progress: best estimated 1RM per exercise (lb/kg toggle) and a weekly consistency chart.
- Settings: dark mode toggle, share data as JSON, clear all data, sign out.
- All workout data lives in the Postgres `entries` table, scoped per-user by Row Level Security
  and synced in real time via Supabase Realtime.

## Known limitations

- **Import from JSON** isn't implemented yet (export/share is) — picking and parsing a file needs
  `expo-document-picker`, left out to keep the initial scope focused. Easy to add later.
- The app icon/splash are still the default Expo placeholders — swap the files in `assets/` and
  update `app.json` when you're ready to brand it.
