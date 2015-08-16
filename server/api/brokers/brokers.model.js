import mongoose from 'mongoose';
const {Schema} = mongoose;

const BrokersSchema = new Schema({

});

export const Brokers = mongoose.model('brokers', BrokersSchema);
