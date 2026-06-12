import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { getMessages } from '../controllers/messageController.js';

const router = Router();

router.get('/:roomId', auth, wrap(getMessages));

export default router;
