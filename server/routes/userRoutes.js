import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { updateMe, blockUser, unblockUser } from '../controllers/userController.js';

const router = Router();

router.put('/me', auth, wrap(updateMe));
router.post('/block/:id', auth, wrap(blockUser));
router.post('/unblock/:id', auth, wrap(unblockUser));

export default router;
