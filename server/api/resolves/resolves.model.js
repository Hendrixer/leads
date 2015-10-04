import mongoose from 'mongoose';
const {Schema} = mongoose;

const ResolvesSchema = new Schema({
  dupe: {},

  lead: {},

  uuid: {
    type: String,
    required: true
  }
});

const ResolvesSessionSchema = new Schema({
  resolves: [{
    type: Schema.Types.ObjectId,
    ref: 'resolves'
  }]
});

export const Resolves = mongoose.model('resolves', ResolvesSchema);
export const ResolvesSession = mongoose.model('resolvessession', ResolvesSessionSchema);
