import { Router } from 'express';
import auth from '../middleware/auth.js';
import { wrap } from '../utils/helpers.js';
import { discover, like, pass, matches, unmatch } from '../controllers/matchController.js';

const router = Router();

router.get('/discover', auth, wrap(discover));
router.post('/like/:id', auth, wrap(like));
router.post('/pass/:id', auth, wrap(pass));
router.get('/matches', auth, wrap(matches));
router.post('/unmatch/:id', auth, wrap(unmatch));

export default router;
