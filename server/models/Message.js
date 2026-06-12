import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    // roomId is the two participant ids sorted and joined with '_',
    // so both sides always derive the same room.
    roomId: { type: String, required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
