import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema(
  {
    // The real author is stored for moderation/deletion but never sent to clients.
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // The Spotted wall is per-campus: a confession is only shown to its college.
    college: { type: String, required: true, index: true },
    pseudonym: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    spot: { type: String, default: 'Somewhere on campus' },
    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    eyes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Confession', confessionSchema);
