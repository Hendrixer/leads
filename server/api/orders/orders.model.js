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
  },

  createdAt: {
    type: Date
  }
});

OrdersSchema.pre('save', function(next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
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
      };
    });
};

const makeQuery = (broker, blacklist) => {
  broker = broker.toJSON();
  const basic = broker.leadFilters.basic;
  const detail = broker.leadFilters.detail;

  const query = {
    creditRating: utils.makeOptionRegex(basic.creditRating, 'creditRatings'),
    'requestedLoan.purpose': utils.makeOptionRegex(basic.loanPurpose, 'loanPurposes'),
    'property.description': utils.makeOptionRegex(basic.propertyType, 'propertyTypes'),
    'address.state': utils.makeRegexFromStates(broker.leadFilters.states),
    _id: {$nin: blacklist}
  };

  if (detail) {
    if (detail.ltv && detail.ltv.use) {
      query.LTV = {
        $gte: detail.ltv.minimum,
        $lte: detail.ltv.maximum
      };
    }

    if (detail.requestedLoanAmount && detail.requestedLoanAmount.use) {
      query['requestedLoan.amountMin'] = {
        $gte: detail.requestedLoanAmount.minimum
      };

      query['requestedLoan.amountMax'] = {
        $lte: detail.requestedLoanAmount.maximum
      };
    }
  }

  return query;
};

const getLeads = ({broker, blacklist, limit, skip})=> {
  const query = makeQuery(broker, blacklist);

  let selection = Leads.find(query).select('-type -dupeKey').lean();

  if (skip) {
    selection = selection.skip(skip);
  }

  if (limit) {
    selection = selection.limit(limit);
  }

  return selection.stream();
};

const createOrder = ({leads, broker}) => {
  const Order = mongoose.model('orders');
  return Order.saveOrder({broker, leads});
};

OrdersSchema.statics.createOrder = ({broker, leads})=> {
  return createOrder({leads, broker});
};

OrdersSchema.statics.getCountForPreorder = (broker) => {
  const Orders = mongoose.model('orders');
  return Brokers.findByIdAsync(broker._id)
  .then(getBrokerOrderHistory)
  .then(({broker, blacklist}) => {
    const query = makeQuery(broker, blacklist);
    return Leads.count(query);
  });
};

OrdersSchema.statics.preorder = (broker, {limit, skip}) => {
  return Brokers.findByIdAsync(broker._id)
  .then(getBrokerOrderHistory)
  .then(opts => {
    opts.limit = limit;
    opts.skip = skip;
    return getLeads(opts);
  });
};

OrdersSchema.statics.saveOrder = (order)=> {
  const Order = mongoose.model('orders');
  const {leads, broker} = order;

  return new Promise((yes, no) => {
    Order.createAsync({broker: broker._id})
      .then(order => {
        order.leads = order.leads.concat(leads);
        order.save((err, order) => {
          err ? no(err) : yes(order);
        });
      });
  });
};

OrdersSchema.methods.trimLeads = ()=> {
  this.leads = _.size(this.leads);
  return this;
};

export const Orders = mongoose.model('orders', OrdersSchema);
