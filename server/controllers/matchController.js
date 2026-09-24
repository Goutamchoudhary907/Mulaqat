import User from '../models/User.js';
import Message from '../models/Message.js';
import { compatibility, roomIdFor } from '../utils/helpers.js';

export async function discover(req, res) {
  const me = await User.findById(req.userId);
  // Hide anyone I blocked, and anyone who blocked me.
  const blockedMe = await User.find({ blocked: me._id }).distinct('_id');
  const excluded = [me._id, ...me.likes, ...me.passes, ...me.matches, ...(me.blocked || []), ...blockedMe];

  const query = {
    _id: { $nin: excluded },
    college: me.college, // same-campus matching only
    interestedIn: { $in: ['everyone', me.gender] },
  };
  if (me.interestedIn !== 'everyone') query.gender = me.interestedIn;

  const candidates = await User.find(query)
    .select('name branch year bio interests vibe avatar gender createdAt')
    .limit(40)
    .lean();

  const deck = candidates
    .map((c) => ({ ...c, compatibility: compatibility(me, c) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);

  const admirers = await User.countDocuments({ likes: me._id, _id: { $nin: me.matches } });
  res.json({ deck, admirers, myVibe: me.vibe });
}

export async function like(req, res) {
  const targetId = req.params.id;
  const [me, target] = await Promise.all([User.findById(req.userId), User.findById(targetId)]);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target.college !== me.college) return res.status(400).json({ message: 'You can only match within your campus' });

  if (!me.likes.map(String).includes(targetId)) me.likes.push(targetId);

  let matched = false;
  if (target.likes.map(String).includes(String(me._id))) {
    matched = true;
    if (!me.matches.map(String).includes(String(target._id))) me.matches.push(target._id);
    if (!target.matches.map(String).includes(String(me._id))) target.matches.push(me._id);
    await target.save();
  }
  await me.save();

  res.json({
    matched,
    roomId: matched ? roomIdFor(me._id, target._id) : null,
    user: matched ? { _id: target._id, name: target.name, avatar: target.avatar, branch: target.branch } : null,
  });
}

export async function pass(req, res) {
  const me = await User.findById(req.userId);
  if (!me.passes.map(String).includes(req.params.id)) me.passes.push(req.params.id);
  await me.save();
  res.json({ ok: true });
}

// Unmatch: remove the match both ways, delete the chat, don't resurface them.
export async function unmatch(req, res) {
  const targetId = req.params.id;
  const [me, target] = await Promise.all([User.findById(req.userId), User.findById(targetId)]);
  if (!target) return res.status(404).json({ message: 'User not found' });

  me.matches = me.matches.filter((u) => String(u) !== targetId);
  target.matches = target.matches.filter((u) => String(u) !== String(me._id));
  // Drop my like too, or their next like would see it and instantly re-match us.
  me.likes = me.likes.filter((u) => String(u) !== targetId);
  if (!me.passes.map(String).includes(targetId)) me.passes.push(targetId);

  await Promise.all([me.save(), target.save()]);
  await Message.deleteMany({ roomId: roomIdFor(me._id, targetId) });
  res.json({ ok: true });
}

export async function matches(req, res) {
  const me = await User.findById(req.userId).populate('matches', 'name avatar branch year bio interests vibe');

  const result = await Promise.all(
    me.matches.map(async (m) => {
      const roomId = roomIdFor(me._id, m._id);
      const lastMessage = await Message.findOne({ roomId }).sort({ createdAt: -1 }).lean();
      return { user: m, roomId, compatibility: compatibility(me, m), lastMessage };
    })
  );

  result.sort(
    (a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)
  );
  res.json(result);
}
