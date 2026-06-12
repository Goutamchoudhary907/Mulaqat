import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    interestedIn: { type: String, enum: ['male', 'female', 'everyone'], required: true },
    branch: { type: String, default: 'Other' },
    year: { type: String, default: '1st Year' },
    bio: { type: String, default: '', maxlength: 300 },
    interests: { type: [String], default: [] },
    // Answers (option indexes) to the 5 vibe-check questions — the heart of matching.
    vibe: { type: [Number], default: [] },
    avatar: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
