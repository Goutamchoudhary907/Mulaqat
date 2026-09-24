import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { roomIdFor } from '../utils/helpers.js';

// userId -> number of open sockets (a user can have multiple tabs).
const online = new Map();

// Lightweight per-user message throttle (in-memory; fine for a single instance).
const sentTimes = new Map(); // userId -> [timestamps]
function allowMessage(uid) {
  const now = Date.now();
  const windowMs = 10_000;
  const max = 15;
  const recent = (sentTimes.get(uid) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    sentTimes.set(uid, recent);
    return false;
  }
  recent.push(now);
  sentTimes.set(uid, recent);
  return true;
}

export function initSocket(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      socket.userId = jwt.verify(token, process.env.JWT_SECRET).id;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const uid = socket.userId;
    online.set(uid, (online.get(uid) || 0) + 1);
    io.emit('presence', [...online.keys()]);

    // Join every match's room so messages arrive wherever the user is in the app.
    try {
      const me = await User.findById(uid).select('matches');
      (me?.matches || []).forEach((m) => socket.join(roomIdFor(uid, m)));
    } catch {
      /* non-fatal — rooms can still be joined explicitly */
    }

    socket.on('join_room', (roomId) => {
      if (String(roomId).split('_').includes(uid)) socket.join(String(roomId));
    });

    socket.on('send_message', async ({ roomId, text }, ack) => {
      try {
        const body = String(text || '').trim().slice(0, 1000);
        roomId = String(roomId);
        if (!body || !roomId.split('_').includes(uid)) return;
        if (!allowMessage(uid)) return; // throttle spam

        // Only matched users can message — enforces unmatch/block in real time.
        const otherId = roomId.split('_').find((x) => x !== uid);
        const sender = await User.findById(uid).select('matches');
        if (!sender || !sender.matches.map(String).includes(otherId)) return;

        const message = await Message.create({ roomId, sender: uid, text: body });
        io.to(roomId).emit('new_message', message);
        if (typeof ack === 'function') ack(message);
      } catch (err) {
        console.error('send_message failed:', err.message);
      }
    });

    socket.on('typing', (roomId) => {
      socket.to(String(roomId)).emit('typing', { roomId: String(roomId), userId: uid });
    });

    socket.on('disconnect', () => {
      const count = (online.get(uid) || 1) - 1;
      if (count <= 0) online.delete(uid);
      else online.set(uid, count);
      io.emit('presence', [...online.keys()]);
    });
  });
}
