import mongoose from 'mongoose';

/**
 * Connects to the MongoDB instance from MONGO_URI (server/.env).
 * A real MongoDB (local install or Atlas) is required — there is no
 * embedded fallback anymore.
 */
export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI is not set. Add your MongoDB connection string to server/.env:');
    console.error('   local install →  MONGO_URI=mongodb://127.0.0.1:27017/mulaqat');
    console.error('   Atlas         →  MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/mulaqat');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    // Hide credentials when logging Atlas-style URIs.
    console.log(`🍃 MongoDB connected → ${uri.replace(/\/\/[^@]+@/, '//***@')}`);
  } catch (err) {
    console.error(`❌ Could not connect to MongoDB: ${err.message}`);
    console.error('   Check that your database is running and MONGO_URI in server/.env is correct.');
    process.exit(1);
  }
}
