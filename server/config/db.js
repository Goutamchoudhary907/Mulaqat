import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Connects to MongoDB. If MONGO_URI is set, uses it (Atlas / local install).
 * Otherwise spins up an embedded MongoDB that persists data to server/.mongo-data,
 * so the app runs with zero database setup.
 */
export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log(`🍃 MongoDB connected → ${uri}`);
      return;
    } catch (err) {
      console.error(`Could not reach MONGO_URI (${err.message}). Falling back to embedded MongoDB…`);
    }
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.join(__dirname, '..', '.mongo-data');
  fs.mkdirSync(dbPath, { recursive: true });

  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger' },
  });

  await mongoose.connect(mongod.getUri('mulaqat'));
  console.log('🍃 Embedded MongoDB running (data persists in server/.mongo-data)');
}
