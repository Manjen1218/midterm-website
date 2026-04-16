import express from 'express';
import { setupAuthController } from '../controllers/auth.js';
import { setupCommentsController } from '../controllers/comments.js';
import { generalLimiter } from '../middleware/security.js';

export const apiRouter = express.Router();
apiRouter.use(generalLimiter);

setupAuthController(apiRouter);
setupCommentsController(apiRouter);
