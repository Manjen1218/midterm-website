# Man-Chen Chao — Personal Site

A full-stack personal website built with **React + Vite** (frontend) and **Express + PostgreSQL** (backend).

## Pages
| Route | Description |
|---|---|
| `/` | Home — hero, stats |
| `/about` | About — bio, skills, timeline |
| `/login` | Login / Register / Account panel |
| `/comments` | Guestbook — view all comments; post/delete if logged in |

---

## Quick Start

### 1. Clone & install
```bash
npm run install:all
```

### 2. Create `backend/.env`
```bash
cp .env.example backend/.env
# Edit backend/.env with your DATABASE_URL and SESSION_SECRET
```

Generate a strong secret:
```bash
openssl rand -hex 32
```

### 3. Set up cloud PostgreSQL
Use any provider: **Supabase**, **Neon**, **Railway**, **Render**, etc.
The app creates tables automatically via `sequelize.sync({ alter: true })`.

### 4. Run in development
```bash
# Terminal 1 — backend (port 8000)
npm run dev:backend

# Terminal 2 — frontend (port 5173, proxied to 8000)
npm run dev:frontend
```

### 5. Build & deploy
```bash
npm run build   # builds frontend into frontend/dist/
npm start       # backend serves the built frontend
```

---

## Security Measures

### SQL Injection
- All DB access goes through **Sequelize ORM** with parameterised queries — no raw SQL string interpolation.
- Input validated with `express-validator` before hitting the DB.
- Username field enforced to `[a-zA-Z0-9_]` pattern.

### XSS (Cross-Site Scripting)
- React renders all user content as **text nodes** (via JSX), never via `dangerouslySetInnerHTML`.
- `helmet` sets strict **Content-Security-Policy** headers blocking inline scripts from other origins.
- Avatar uploads: only `image/*` MIME types accepted; files stored on disk with random UUID filenames, never executed.
- `X-Content-Type-Options: nosniff` prevents MIME-type confusion attacks.

### CSRF (Cross-Site Request Forgery)
- Session cookie uses `sameSite: 'lax'` — cross-origin POST requests won't carry the cookie.
- `secure: true` in production so the cookie is only sent over HTTPS.
- `httpOnly: true` so JavaScript cannot read or steal the session cookie.
- Session regenerated on login to prevent session fixation.

### XXE (XML External Entity)
- The app accepts **only JSON and multipart/form-data** — no XML parsers are used anywhere.
- `express.json({ limit: '50kb' })` and `express.urlencoded({ extended: false })` prevent oversized payloads.

### Additional hardening
- `helmet` sets 15+ security headers automatically.
- Rate limiting: auth endpoints (login/register) capped at **20 requests per 15 min** per IP.
- General API rate limit: 200 requests per 15 min.
- Passwords hashed with **bcrypt** (cost factor 12).
- Uploaded file size capped at **2 MB**; only image MIME types allowed.
- Stack traces are never exposed to the client in production.
- Sessions stored server-side in PostgreSQL via `connect-pg-simple` — no sensitive data in the cookie.

---

## Project Structure

```
mysite/
├── backend/
│   ├── app.js                # Entry — Express + helmet + session
│   ├── routes/index.js       # API router
│   ├── controllers/
│   │   ├── auth.js           # Register, login, logout, avatar
│   │   └── comments.js       # CRUD for comments
│   ├── models/index.js       # Sequelize models (User, Comment)
│   ├── middleware/security.js # Rate limiters, auth guard, validator
│   └── uploads/              # Avatar files (gitignored)
├── frontend/
│   └── src/
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       ├── components/Navbar.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── LoginPage.jsx   # Login + Register + Account panel
│       │   └── CommentsPage.jsx
│       ├── index.css
│       └── main.jsx
├── .env.example
└── package.json
```
