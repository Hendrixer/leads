import mongoose from 'mongoose';
const {Schema} = mongoose;

const NotesSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers',
    required: true
  },
  createdAt: {
    type: Date
  }
});

NotesSchema.pre('save', function(next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

export const Notes = mongoose.model('notes', NotesSchema);
