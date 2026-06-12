import Message from '../models/Message.js';

export async function getMessages(req, res) {
  const { roomId } = req.params;
  if (!roomId.split('_').includes(req.userId)) {
    return res.status(403).json({ message: 'This is not your conversation' });
  }
  const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).limit(300).lean();
  res.json(messages);
}
