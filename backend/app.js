import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
import { apiRouter } from './routes/index.js';
import { syncDB } from './models/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pkg;
const PgStore = connectPgSimple(session);

const { SESSION_SECRET, DATABASE_URL, NODE_ENV, PORT, ALLOWED_ORIGIN } = process.env;
if (!SESSION_SECRET) throw new Error('SESSION_SECRET not set');
if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

const isProd = NODE_ENV === 'production';
const port = PORT || 8000;

// Build list of allowed origins (supports ngrok, custom domains, etc.)
// ALLOWED_ORIGIN can be a comma-separated list, e.g.:
//   ALLOWED_ORIGIN=https://dutiful-most-vagrantly.ngrok-free.dev,http://localhost:5173
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8000',
  ...(ALLOWED_ORIGIN ? ALLOWED_ORIGIN.split(',').map((o) => o.trim()) : []),
];

const app = express();

// ─── Security headers (helmet) ────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        // Allow API calls back to self and any allowed origins
        connectSrc: ["'self'", ...allowedOrigins],
      },
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Trust the X-Forwarded-Proto header from ngrok so HTTPS is detected correctly
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
  })
);

// Trust first proxy (ngrok / reverse proxy) so req.secure works correctly
app.set('trust proxy', 1);

// ─── CORS ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and any whitelisted origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────
// Limit body size to prevent DoS / XXE (JSON only; no XML accepted)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// ─── Session (stored in PostgreSQL) ──────────────────────────────
const pgPool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { require: true, rejectUnauthorized: false },
});

app.use(
  session({
    store: new PgStore({ pool: pgPool, createTableIfMissing: true }),
    secret: SESSION_SECRET,
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,          // XSS: JS cannot read cookie
      secure: 'auto',          // auto = secure when HTTPS (ngrok/proxy aware)
      sameSite: 'lax',         // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// ─── Static files ─────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ─── API ──────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ─── SPA catch-all ────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ─── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  // Don't leak stack traces
  res.status(err.status || 500).json({ error: isProd ? 'Server error' : err.message });
});

// ─── Boot ─────────────────────────────────────────────────────────
syncDB().then(() => {
  app.listen(port, '0.0.0.0', () => console.log(`Server running at http://0.0.0.0:${port}`));
});
