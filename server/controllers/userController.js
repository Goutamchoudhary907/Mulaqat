import User from '../models/User.js';
import Message from '../models/Message.js';
import { clean, roomIdFor } from '../utils/helpers.js';

export async function updateMe(req, res) {
  const allowed = ['name', 'bio', 'interests', 'avatar', 'branch', 'year', 'interestedIn', 'vibe'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  res.json({ user: clean(user) });
}

// Block a user: hide both ways, break any match, and wipe the conversation.
export async function blockUser(req, res) {
  const targetId = req.params.id;
  if (targetId === req.userId) return res.status(400).json({ message: "You can't block yourself" });

  const [me, target] = await Promise.all([User.findById(req.userId), User.findById(targetId)]);
  if (!target) return res.status(404).json({ message: 'User not found' });

  if (!me.blocked.map(String).includes(targetId)) me.blocked.push(targetId);
  me.matches = me.matches.filter((u) => String(u) !== targetId);
  me.likes = me.likes.filter((u) => String(u) !== targetId);
  target.matches = target.matches.filter((u) => String(u) !== String(me._id));

  await Promise.all([me.save(), target.save()]);
  await Message.deleteMany({ roomId: roomIdFor(me._id, targetId) });
  res.json({ ok: true });
}

export async function unblockUser(req, res) {
  const me = await User.findById(req.userId);
  me.blocked = me.blocked.filter((u) => String(u) !== req.params.id);
  await me.save();
  res.json({ ok: true });
}
