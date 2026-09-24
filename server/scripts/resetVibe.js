/**
 * One-time reset: clear every user's vibe answers.
 *
 * WHY: vibe answers are stored as positional option indexes, matched
 * position-by-position. The vibe questions changed (new 6-question set), so old
 * stored answers no longer line up with the new questions. Clearing them makes
 * each user re-take the quick vibe check on their next visit (Discover already
 * gates on a complete vibe check), keeping matching correct.
 *
 * Accounts, names, colleges, chats, matches are all untouched — only the 5/6
 * vibe numbers are cleared.
 *
 * Run manually from the `server/` directory (reads MONGO_URI from .env):
 *     node scripts/resetVibe.js
 *   or
 *     npm run migrate:reset-vibe
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

async function run() {
  await connectDB();

  const withVibe = await User.countDocuments({ 'vibe.0': { $exists: true } });
  const result = await User.updateMany({}, { $set: { vibe: [] } });

  console.log(`Cleared vibe answers for ${result.modifiedCount} user(s) (${withVibe} had answers).`);
  console.log('They will be prompted to re-take the vibe check on their next visit.');

  await mongoose.disconnect();
  console.log('✅ Vibe reset complete.');
}

run().catch(async (err) => {
  console.error('❌ Vibe reset failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
