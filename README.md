# FlexLog (mobile)

A workout tracker built with **Expo + Expo Router**, **NativeWind** (Tailwind for React Native),
and **Supabase** (Auth + Postgres + Realtime), so the sets you log follow you to any phone, at any
gym, the moment you save them.

The previous web version (Vite + React + localStorage) has been moved to [`legacy-web/`](./legacy-web)
and is untouched — nothing was deleted, it's just no longer the active app.

## Features

**Auth**
- Email/password sign up, login, logout via Supabase Auth
- Routes are gated with Expo Router's `Stack.Protected` — signed out users can only reach
  `(auth)`, signed in users can only reach `(tabs)`
- "Forgot password?" sends a real Supabase password-reset email
- No social login (Google/GitHub/Apple) yet — that needs OAuth provider setup in the Supabase
  dashboard plus native auth packages, so it's intentionally left out rather than faked

**Log a set**
- Exercise picker (tap the exercise field to open it): search, filter by category
  (Chest / Back / Legs / Shoulders / Arms / Core / Other), a **Favorites** tab, a **Recent** tab
  built from your own logging history, and one-tap quick-add for a custom exercise that doesn't
  exist in the library yet
- Every exercise gets a color-coded icon matched to its muscle group and movement (a barbell
  press glyph, a flexed-arm curl glyph, a rowing glyph, etc.) instead of one generic icon
- Enter weight, sets, and reps — one entry can represent e.g. "3 sets × 8 reps @ 135lb"
- Live estimated-1RM preview as you type weight/reps, using the Epley formula
- Editing an existing set or repeating a past one pre-fills the form
- A distinct celebratory toast + haptic when a logged set beats your previous best estimated 1RM
  for that exercise

**History**
- Every set grouped by date, with 🏆 PR badges on entries that were a personal best
- Filter chips per exercise
- Swipe a row **left** to reveal Edit / Delete, swipe **right** to reveal Repeat — delete comes
  with an Undo toast

**Progress**
- Best estimated 1RM per exercise (lb/kg toggle), ranked with medal markers for the top 3
- Weekly consistency bar chart with a running streak counter

**Profile**
- Colored gradient initials avatar (deterministic per user), tap-to-edit display name, email,
  member-since date
- Lifetime stats: total sets logged, exercises tracked, current streak, best estimated 1RM

**Settings**
- Dark mode toggle
- Export all your data as JSON via the native share sheet
- Clear all data (two-tap confirm)

**Sync**
- Everything above reads/writes Postgres tables scoped to your account via Row Level Security —
  log in on a second device and your data (and, for `entries`, live changes) is just there

**Feel**
- A small shared design system (`src/lib/theme.js`, `Card`, `Chip`, `Badge`, `MetricCard`,
  `EmptyState`, `SettingRow`, `SectionHeader`, `IconButton`) so every screen uses the same
  surfaces, spacing, and colors instead of one-off styles
- Reanimated micro-interactions: spring-in list rows, a sliding active-tab indicator, success
  flash on save, count-up stat numbers
- Swipeable list rows (`react-native-gesture-handler`) instead of tiny inline buttons
- Shimmer skeleton loaders while data is in flight, instead of a bare spinner
- Haptic feedback on nearly every meaningful tap (`expo-haptics`)

## Tech stack

| Layer | Choice |
|---|---|
| App framework | Expo (SDK 57), Expo Router (file-based navigation) |
| UI | React Native 0.86, NativeWind 4 (Tailwind classes), `@expo/vector-icons` (Ionicons + MaterialCommunityIcons), `expo-linear-gradient` |
| Animation / gestures | `react-native-reanimated`, `react-native-gesture-handler` (swipeable rows, custom tab bar), `expo-haptics` |
| Charts | `react-native-gifted-charts`, `react-native-svg` |
| Backend | Supabase — Postgres, Auth, Realtime, Row Level Security |
| Local persistence | `@react-native-async-storage/async-storage` (unit preference, theme) |

## Project structure

```
app/                        Expo Router — file-based routes
  _layout.jsx                 Root: GestureHandlerRootView, providers, gates (tabs) vs (auth)
  (auth)/                     Public routes — only reachable when signed out
    _layout.jsx
    index.jsx                   Login screen
    signup.jsx                   Sign up screen
  (tabs)/                     Protected routes — only reachable when signed in
    _layout.jsx                 Tab bar (Log / History / Progress / Profile / Settings)
    index.jsx                    Log a set + stats + recent activity
    history.jsx                  Full history, grouped by date, filterable
    progress.jsx                 Best 1RM per exercise + consistency chart
    profile.jsx                  Avatar, editable name, lifetime stats, sign out
    settings.jsx                 Dark mode, export, clear data

src/
  lib/                       Framework-free business logic (ported from the web app)
    supabase.js                 Supabase client init (reads from .env)
    theme.js                     Shared color tokens for places className can't reach
    categories.js                 Per-muscle-group accent colors
    exerciseIcons.js              Exercise name -> movement icon lookup
    oneRepMax.js                 Epley 1RM estimate + best-per-exercise ranking
    dates.js                     Streaks, week grouping, local-calendar-date helpers
    units.js                     lb <-> kg conversion
    authErrors.js                 Supabase auth errors -> friendly copy
  context/                    App-wide state, kept separate from the UI
    AuthContext.jsx              Supabase auth session, profile update, password reset
    EntriesContext.jsx           Realtime-synced workout entries + edit/repeat state
    ExercisesContext.jsx         Exercise library + favorites
    ToastContext.jsx             In-app toast notifications (incl. PR celebration variant)
  hooks/
    useEntries.js, useExercises.js, useCountUp.js, usePersistedState.js
  components/                Shared, reusable UI pieces
    ScreenContainer, ScreenHeader, SectionHeader, Card    layout primitives
    Chip, Badge, IconButton, SettingRow, EmptyState        small reusable controls
    Avatar, Skeleton                                       profile avatar, shimmer placeholders
    WorkoutForm, ExercisePicker                            the log-a-set flow
    EntryRow                                               swipeable set row (History + recent activity)
    MetricCard, OneRepMaxSummary, ConsistencyChart         progress + stats
    PrimaryButton, TextField, PasswordField, AnimatedTabBar, AnimatedTabButton
```

Auth screens, protected app screens, business logic, and shared UI each live in their own
directory so the auth flow can be reasoned about independently from the logged-in app.

