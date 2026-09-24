import { Router } from 'express';
import auth from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { wrap } from '../utils/helpers.js';
import { register, login, me } from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, wrap(register));
router.post('/login', authLimiter, wrap(login));
router.get('/me', auth, wrap(me));

export default router;
