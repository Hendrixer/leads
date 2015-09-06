import mongoose from 'mongoose';
import {Brokers} from '../brokers/brokers.model';
import {Leads} from '../leads/leads.model';
import _ from 'lodash';
const {Schema} = mongoose;


const OrdersSchema = new Schema({
  leads: [
    {type: Schema.Types.ObjectId, ref: 'leads'}
  ],

  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers',
    required: true
  }
});


OrdersSchema.statics.createNewOrder = (order)=> {
  const Order = mongoose.model('orders');

  const {leads, broker} = order;

  return new Promise((yes, no) => {
    Order.createAsync({broker})
      .then(order => {
        order.leads = order.leads.concat(leads);

        order.save((err, order) => {
          err ? no(err): yes(order);
        });
      });
  });
};

export const Orders = mongoose.model('orders', OrdersSchema);
