import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { updateMe } from '../controllers/userController.js';

const router = Router();

router.put('/me', auth, wrap(updateMe));

export default router;
