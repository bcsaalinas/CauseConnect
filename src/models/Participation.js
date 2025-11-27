import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  volunteerMessage: {
    type: String,
    trim: true
  },
  orgMessage: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate sign-ups
participationSchema.index({ activity: 1, volunteer: 1 }, { unique: true });

const Participation = mongoose.model('Participation', participationSchema);
export default Participation;
