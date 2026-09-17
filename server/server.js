import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { initSocket } from './socket/socket.js';
import { seedIfEmpty } from './seed.js';
import { startKeepAlive } from './utils/keepAlive.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import confessionRoutes from './routes/confessionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// Render runs behind a proxy — needed so rate limiting keys on the real client IP.
app.set('trust proxy', 1);
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
app.use('/api/reports', reportRoutes);

// Any unmatched /api route is a real 404 — never fall through to the SPA.
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// Serve the built React app (single-service deploy). When client/dist exists,
// static assets are served and every other route returns index.html so
// client-side routing works on refresh / deep links.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  if (process.env.SEED_ON_EMPTY === 'true') await seedIfEmpty();
  server.listen(PORT, () => {
    console.log(`💌 Mulaqat server running → http://localhost:${PORT}`);
    startKeepAlive();
  });
});
