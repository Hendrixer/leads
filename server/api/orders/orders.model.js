import mongoose from 'mongoose';
const {Schema} = mongoose;

const OrdersSchema = new Schema({
  leads: [
    {type: mongoose.Types.ObjectId, ref: 'leads'}
  ]

  // broker: {
  //   type: mongoose.Types.ObjectId,
  //   ref: 'brokers',
  //   required: true,
  // }
});

export const Orders = mongoose.model('orders', OrdersSchema);
