# ScoutConnect — Fixes Applied (Aug 3, 2026)

Verified against the actual source in `WEB-ADV-PROJECT.rar`. The backend was
**booted and live-tested** (routes + validation); the frontend was parsed with
Babel (all 22 source files compile). See "One-time setup" at the bottom.

---

## Root cause (why nothing worked)

`backend/routes/authRoutes.js` did `require('axios')`, but **axios was never
installed** (not in `package.json` or the lockfile). Node threw
`Cannot find module 'axios'` on startup, so the API server **never booted** —
every frontend request failed. Reproduced and then fixed.

---

## Backend

| File | Change |
|---|---|
| `routes/authRoutes.js` | Removed the missing `axios` import; Google token verification now uses Node's built-in `fetch` (no new dependency). |
| `routes/authRoutes.js` | `/register` now reads `role` and **whitelists it to `scout`/`parent`** — `leader`/`admin` can't be self-assigned via public signup (they're provisioned by an admin). |
| `routes/authRoutes.js` | Added **server-side validation** (email format, 8-digit phone, password length + digit) — previously only on the client, bypassable via direct API calls. |
| `routes/contactRoutes.js` | **New.** Implements `POST /api/contact` (was missing → the contact form always 404'd). |
| `routes/passwordResetRoutes.js` | **New.** Implements `POST /api/forgot-password/request` and `/verify`. Codes are 6-digit, stored **bcrypt-hashed** with a 15-min expiry; anti-enumeration (always returns generic success); dev mode logs the code to the server console; real email sending kicks in once `SMTP_*` is set. |
| `server.js` | Mounted the two new routers. |
| `config/db.js` | Reads DB credentials from `.env` (previous hardcoded values kept as fallbacks — nothing changes locally). |
| `package.json` | Removed the stray `"type": "module"` accidentally nested inside `"scripts"`; fixed `"main"` to `server.js`. |
| `.env` / `.env.example` | Populated working local values + a committable template. |
| `migrations/001_contact_and_password_reset.sql` | **New.** Creates the `contact_messages` and `password_resets` tables the new routes need. Run once. |

## Frontend

| File | Change |
|---|---|
| `src/config.js` | **New.** Single `API_BASE_URL` (overridable via `REACT_APP_API_URL`). All 15 hardcoded `http://localhost:5000` URLs across 8 files now use it. |
| `src/Pages/Register.js` | Fixed endpoint `/api/signup` → **`/api/register`** (registration always failed before). Removed the "Leader" option from the role dropdown to match the backend whitelist. |
| `src/App.js` | Removed **duplicate `GoogleOAuthProvider` *and* duplicate `LanguageProvider`** — the whole app had been nested inside two of each. They now live only in `index.js`. |
| `src/Components/LanguageContext.js` | `language` now starts as `null` when nothing is stored, so the first-visit **language chooser can actually appear** (it was hardcoded to `'en'`, making the prompt unreachable). Persistence effect guarded. |
| `src/Components/translations.js` | Added 11 missing keys in **en/fr/ar** (`contactUs`, `fullName`, `message`, `sendMessage`, `adminPanel`, `leaderPortal`, …). The Contact page used to render raw key names. All three languages now have identical key sets. |
| `src/Components/Navbar.js` | Unified onto the shared `t('key', fallback)` function (it had its own inconsistent lookup); **guarded** the `JSON.parse(localStorage.getItem('user'))` that renders on every page; null-safe language selector. |
| `src/Components/Footer.js` | Instagram icon pointed at the **Facebook** URL — now points to `instagram.com`. ⚠️ Handle guessed as `muslimscoutma` (matches your Facebook handle); TikTok uses `muslimscout_ma`. **Confirm the real IG handle.** |
| `src/App.test.js` | Replaced the default CRA "learn react" test (which made `npm test` fail) with a translation-parity test. |
| `public/index.html`, `public/manifest.json` | Rebranded from "React App" / "Create React App Sample" to **ScoutConnect**; theme color → emerald. |
| Dead files | Removed unused `src/App.css` and `src/logo.svg`. |

---

## One-time setup

1. **Backend deps** (axios no longer needed):
   ```
   cd backend && npm install
   ```
2. **Create the two new tables** — run `backend/migrations/001_contact_and_password_reset.sql`
   once in phpMyAdmin against your `scout_db` database.
3. **Env**: `backend/.env` is already filled for local XAMPP (MySQL on port 3307,
   empty root password). Adjust if yours differs. Password reset works in **dev mode**
   without SMTP (code prints to the server console); set `SMTP_*` to send real emails.
4. **Frontend**: `cd scout-frontend && npm install && npm start`. To point at a
   non-local backend, set `REACT_APP_API_URL` (see `scout-frontend/.env.example`).

## Run
```
cd backend && npm run dev        # API on :5000
cd scout-frontend && npm start   # app on :3000
```
