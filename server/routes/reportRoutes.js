import { Router } from 'express';
import auth from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { wrap } from '../utils/helpers.js';
import { createReport } from '../controllers/reportController.js';

const router = Router();

router.post('/', auth, writeLimiter, wrap(createReport));

export default router;
