/**
 * One-time backfill: stamp every pre-existing user & confession (the ones
 * created before the multi-college change, so they have no `college` field)
 * with "Medi-Caps University".
 *
 * SAFE / IDEMPOTENT: only touches documents that are missing a college, so
 * running it more than once does nothing extra, and it never overwrites a
 * college that's already set.
 *
 * Run manually from the `server/` directory (it reads MONGO_URI from .env):
 *     node scripts/backfillCollege.js
 *   or
 *     npm run migrate:college
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Confession from '../models/Confession.js';

dotenv.config();

const COLLEGE = 'Medi-Caps University';
// Matches docs created before `college` existed, or left blank/null.
const missingCollege = { $or: [{ college: { $exists: false } }, { college: null }, { college: '' }] };

async function run() {
  await connectDB();

  const usersToFix = await User.countDocuments(missingCollege);
  const confessionsToFix = await Confession.countDocuments(missingCollege);
  console.log(`Found ${usersToFix} user(s) and ${confessionsToFix} confession(s) without a college.`);

  const u = await User.updateMany(missingCollege, { $set: { college: COLLEGE } });
  const c = await Confession.updateMany(missingCollege, { $set: { college: COLLEGE } });

  console.log(`👥 Users updated:       ${u.modifiedCount} → "${COLLEGE}"`);
  console.log(`💌 Confessions updated: ${c.modifiedCount} → "${COLLEGE}"`);

  await mongoose.disconnect();
  console.log('✅ Backfill complete.');
}

run().catch(async (err) => {
  console.error('❌ Backfill failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
