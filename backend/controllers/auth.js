import bcrypt from 'bcrypt';
import { body } from 'express-validator';
import { User } from '../models/index.js';
import { validate, authLimiter, requireAuth } from '../middleware/security.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const UPLOAD_DIR = path.resolve('./uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ─── Multer — avatar upload ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

// ─── Validation rules ────────────────────────────────────────────
const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 64 })
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fff]+$/)
    .withMessage('Username 2-64 chars, alphanumeric / underscore only'),
  body('email').trim().isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

/** @param {import('express').Router} r */
export function setupAuthController(r) {
  // GET /api/v1/auth/me
  r.get('/auth/me', (req, res) => {
    if (!req.session?.userId) return res.json({ user: null });
    User.findByPk(req.session.userId, {
      attributes: ['id', 'username', 'email', 'avatarPath'],
    })
      .then((u) => res.json({ user: u }))
      .catch(() => res.status(500).json({ error: 'Server error' }));
  });

  // POST /api/v1/auth/register
  r.post(
    '/auth/register',
    authLimiter,
    upload.single('avatar'),
    registerRules,
    validate,
    async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(409).json({ error: 'Email already registered' });
        }
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(409).json({ error: 'Username already taken' });
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
        const user = await User.create({ username, email, passwordHash, avatarPath });
        req.session.userId = user.id;
        res.status(201).json({
          user: { id: user.id, username: user.username, email: user.email, avatarPath: user.avatarPath },
        });
      } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  );

  // POST /api/v1/auth/login
  r.post('/auth/login', authLimiter, loginRules, validate, async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      // Regenerate session to prevent fixation
      req.session.regenerate((err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        req.session.userId = user.id;
        res.json({
          user: { id: user.id, username: user.username, email: user.email, avatarPath: user.avatarPath },
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // POST /api/v1/auth/logout
  r.post('/auth/logout', requireAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('sessionId');
      res.json({ ok: true });
    });
  });

  // PATCH /api/v1/auth/avatar
  r.patch('/auth/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file' });
      const user = await User.findByPk(req.session.userId);
      // Remove old avatar
      if (user.avatarPath) {
        const oldPath = path.resolve(`.${user.avatarPath}`);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatarPath = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ avatarPath: user.avatarPath });
    } catch (err) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      console.error(err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}
