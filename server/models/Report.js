import mongoose from 'mongoose';

// A user-submitted report against another user or a confession. Reviewed
// out-of-band (DB / future admin tools); never exposed to other users.
const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['user', 'confession'], required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confession: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession' },
    reason: { type: String, default: '', maxlength: 500 },
    status: { type: String, enum: ['open', 'reviewed', 'actioned'], default: 'open', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
