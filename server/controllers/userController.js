import User from '../models/User.js';
import { clean } from '../utils/helpers.js';

export async function updateMe(req, res) {
  const allowed = ['name', 'bio', 'interests', 'avatar', 'branch', 'year', 'interestedIn', 'vibe'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  res.json({ user: clean(user) });
}
