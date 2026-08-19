# FlexLog (mobile)

A workout tracker built with Expo + Expo Router, NativeWind (Tailwind for React Native), and
Firebase (Auth + Firestore) so your logged sets sync to your account and follow you to any phone,
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
    firebase.js              Firebase app/auth/firestore init (reads from .env)
    oneRepMax.js, dates.js, units.js
    authErrors.js
  context/                 App-wide state, kept separate from the UI
    AuthContext.jsx          Firebase auth session
    EntriesContext.jsx        Firestore-synced workout entries + edit state
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

### 1. Create a Firebase project

You'll need to do this yourself in the [Firebase console](https://console.firebase.google.com/) —
it requires your own Google account, so it isn't something that can be scripted for you:

1. Create a new project (Analytics is optional, you can skip it).
2. **Build → Authentication → Get started → Sign-in method** → enable **Email/Password**.
3. **Build → Firestore Database → Create database** → start in production mode, pick a region.
4. In Firestore, go to the **Rules** tab and replace the default rules with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/entries/{entryId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   This keeps every user's sets private to their own account.
5. **Project settings (gear icon) → General → Your apps → Web app (`</>`)** → register an app
   (no need for Firebase Hosting). Copy the `firebaseConfig` values it gives you.

### 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the values from step 1.5 (`apiKey`, `authDomain`, `projectId`,
`storageBucket`, `messagingSenderId`, `appId`). `.env` is gitignored, so your keys stay local.

### 3. Install and run

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android) to run it on your phone. Sign up for an
account on your phone, then sign in with the same account on another device to see your sets sync.

## What's implemented

- Email/password sign up, login, logout (Firebase Auth), gated with Expo Router's
  `Stack.Protected`.
- Log a set, live estimated-1RM preview, per-exercise suggestions.
- History grouped by date, PR badges, edit/delete with undo, per-exercise filter chips.
- Progress: best estimated 1RM per exercise (lb/kg toggle) and a weekly consistency chart.
- Settings: dark mode toggle, share data as JSON, clear all data, sign out.
- All workout data lives in Firestore under `users/{uid}/entries`, synced in real time.

## Known limitations

- **Import from JSON** isn't implemented yet (export/share is) — picking and parsing a file needs
  `expo-document-picker`, left out to keep the initial scope focused. Easy to add later.
- The app icon/splash are still the default Expo placeholders — swap the files in `assets/` and
  update `app.json` when you're ready to brand it.
