import mongoose from 'mongoose';
const {Schema} = mongoose;

const ResolvesSchema = new Schema({
  dupes: [
    {dupe: {}, alike: {}}
  ]
});

export const Resolves = mongoose.model('resolves', ResolvesSchema);
