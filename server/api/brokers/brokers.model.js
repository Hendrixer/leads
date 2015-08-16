import mongoose from 'mongoose';
const {Schema} = mongoose;

const BrokersSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  displayName: {
    type: String,
    required: true,
    unique: true
  },

  email: String,
  phone: Number,
  website: String,

  address: {
    street: String,
    extra: String,
    city: String,
    state: String,
    zip: Number
  },

  timezone: String
});

export const Brokers = mongoose.model('brokers', BrokersSchema);
