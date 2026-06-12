import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import {
  createConfession,
  listConfessions,
  reactConfession,
  deleteConfession,
} from '../controllers/confessionController.js';

const router = Router();

router.get('/', auth, wrap(listConfessions));
router.post('/', auth, wrap(createConfession));
router.post('/:id/react', auth, wrap(reactConfession));
router.delete('/:id', auth, wrap(deleteConfession));

export default router;
