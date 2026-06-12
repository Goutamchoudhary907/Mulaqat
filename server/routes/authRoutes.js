import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { register, login, me } from '../controllers/authController.js';

const router = Router();

router.post('/register', wrap(register));
router.post('/login', wrap(login));
router.get('/me', auth, wrap(me));

export default router;
