import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { initSocket } from './socket/socket.js';
import { seedIfEmpty } from './seed.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import confessionRoutes from './routes/confessionRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: true } });
initSocket(io);

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, app: 'Mulaqat', campus: 'Medi-Caps University, Indore' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/confessions', confessionRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  if (process.env.SEED_ON_EMPTY === 'true') await seedIfEmpty();
  server.listen(PORT, () => console.log(`💌 Mulaqat server running → http://localhost:${PORT}`));
});
