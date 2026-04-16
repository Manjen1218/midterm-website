import { body } from 'express-validator';
import { Comment, User } from '../models/index.js';
import { validate, requireAuth } from '../middleware/security.js';

const commentRules = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be 1–2000 characters'),
];

/** @param {import('express').Router} r */
export function setupCommentsController(r) {
  // GET /api/v1/comments
  r.get('/comments', async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: [{ model: User, attributes: ['id', 'username', 'avatarPath'] }],
        order: [['createdAt', 'ASC']],
        limit: 200,
      });
      res.json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // POST /api/v1/comments
  r.post('/comments', requireAuth, commentRules, validate, async (req, res) => {
    try {
      const comment = await Comment.create({
        content: req.body.content,
        userId: req.session.userId,
      });
      const full = await Comment.findByPk(comment.id, {
        include: [{ model: User, attributes: ['id', 'username', 'avatarPath'] }],
      });
      res.status(201).json(full);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post comment' });
    }
  });

  // DELETE /api/v1/comments/:id
  r.delete('/comments/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
      const comment = await Comment.findOne({ where: { id, userId: req.session.userId } });
      if (!comment) return res.status(404).json({ error: 'Not found' });
      await comment.destroy();
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete' });
    }
  });
}
