import mongoose from 'mongoose';
import {Brokers} from '../brokers/brokers.model';
import {Leads} from '../leads/leads.model';
import * as utils from '../constants';
import {logger} from '../../util/logger';
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

const getBrokerOrderHistory = (broker)=> {
  const Orders = mongoose.model('orders');

  return Orders.find({broker: broker._id}).lean().execAsync()
    .then(orders => {
      return {
        broker,
        blacklist: _.reduce(orders, (leads, order) => {
          leads = leads.concat(order.leads);
          return leads;
        }, [])
      }
    });
};

const getLeads = ({broker, blacklist})=> {
  const basic = broker.toJSON().leadFilters.basic;
  const query = {
    creditRating: utils.makeOptionRegex(basic.creditRating, 'creditRatings'),
    'requestedLoan.purpose': utils.makeOptionRegex(basic.loanPurpose, 'loanPurposes'),
    'property.description': utils.makeOptionRegex(basic.propertyType, 'propertyTypes'),
    _id: {$nin: blacklist}
  };
  return Leads.findAsync(query)
    .then(leads => {
      return {leads, broker};
    });
};

const createOrder = ({leads, broker}) => {
  const Order = mongoose.model('orders');

  return Order.saveOrder({broker, leads: _.pluck(leads, '_id')});
};

OrdersSchema.statics.createOrder = (broker)=> {
  return Brokers.findByIdAsync(broker._id)
  .then(getBrokerOrderHistory)
  .then(getLeads)
  .then(createOrder);
};


OrdersSchema.statics.saveOrder = (order)=> {
  const Order = mongoose.model('orders');

  const {leads, broker} = order;

  return new Promise((yes, no) => {
    Order.createAsync({broker: broker._id})
      .then(order => {
        order.leads = order.leads.concat(leads);

        order.save((err, order) => {
          err ? no(err): yes(order);
        });
      });
  });
};

export const Orders = mongoose.model('orders', OrdersSchema);
