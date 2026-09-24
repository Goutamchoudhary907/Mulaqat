import Report from '../models/Report.js';

export async function createReport(req, res) {
  const { targetType, targetId, reason } = req.body;
  if (!['user', 'confession'].includes(targetType) || !targetId) {
    return res.status(400).json({ message: 'Invalid report' });
  }

  const doc = {
    reporter: req.userId,
    targetType,
    reason: String(reason || '').slice(0, 500),
  };
  if (targetType === 'user') doc.targetUser = targetId;
  else doc.confession = targetId;

  await Report.create(doc);
  res.status(201).json({ ok: true });
}
