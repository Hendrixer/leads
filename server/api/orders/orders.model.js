import mongoose from 'mongoose';
const {Schema} = mongoose;

const OrdersSchema = new Schema({

});

export const Orders = mongoose.model('orders', OrdersSchema);
