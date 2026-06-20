import Confession from '../models/Confession.js';
import User from '../models/User.js';
import { pseudonym } from '../utils/helpers.js';

function serialize(c, userId) {
  const obj = c.toObject ? c.toObject() : c;
  return {
    _id: obj._id,
    text: obj.text,
    spot: obj.spot,
    pseudonym: obj.pseudonym,
    hearts: obj.hearts.length,
    hearted: obj.hearts.map(String).includes(String(userId)),
    mine: String(obj.author) === String(userId),
    createdAt: obj.createdAt,
  };
}

export async function createConfession(req, res) {
  const text = String(req.body.text || '').trim();
  const spot = String(req.body.spot || 'Somewhere on campus');
  if (text.length < 3) return res.status(400).json({ message: 'Write a little more than that 😄' });
  if (text.length > 500) return res.status(400).json({ message: 'Keep it under 500 characters' });

  const me = await User.findById(req.userId).select('college').lean();
  const confession = await Confession.create({
    author: req.userId, college: me.college, text, spot, pseudonym: pseudonym(),
  });
  res.status(201).json(serialize(confession, req.userId));
}

export async function listConfessions(req, res) {
  const me = await User.findById(req.userId).select('college').lean();
  const list = await Confession.find({ college: me.college }).sort({ createdAt: -1 }).limit(80).lean();
  res.json(list.map((c) => serialize(c, req.userId)));
}

export async function reactConfession(req, res) {
  const { type } = req.body; // 'hearts'
  if (type !== 'hearts') return res.status(400).json({ message: 'Invalid reaction' });

  const confession = await Confession.findById(req.params.id);
  if (!confession) return res.status(404).json({ message: 'Confession not found' });

  const already = confession.hearts.map(String).includes(req.userId);
  if (already) {
    confession.hearts = confession.hearts.filter((u) => String(u) !== req.userId);
  } else {
    confession.hearts.push(req.userId);
  }
  await confession.save();
  res.json(serialize(confession, req.userId));
}

export async function deleteConfession(req, res) {
  const confession = await Confession.findById(req.params.id);
  if (!confession) return res.status(404).json({ message: 'Confession not found' });
  if (String(confession.author) !== req.userId) {
    return res.status(403).json({ message: 'Not yours to delete' });
  }
  await confession.deleteOne();
  res.json({ ok: true });
}
