'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrdersPair = exports.Orders = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _brokers = require('../brokers/brokers.model');

var _leads = require('../leads/leads.model');

var _constants = require('../constants');

var utils = _interopRequireWildcard(_constants);

var _logger = require('../../util/logger');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var OrdersSchema = new Schema({
  leadsOrdered: {
    type: Number,
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

var OrdersPairSchema = new Schema({
  lead: {
    type: Schema.Types.ObjectId,
    ref: 'leads'
  },

  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers'
  },

  order: {
    type: Schema.Types.ObjectId,
    ref: 'orders'
  }
});

OrdersSchema.pre('save', function (next) {
  var now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

var getBrokerOrderHistory = function getBrokerOrderHistory(broker) {
  var OrderPairs = _mongoose2.default.model('orderspairs');

  return OrderPairs.find({ broker: broker._id }).lean().execAsync().then(function (pairs) {
    return {
      broker: broker,
      blacklist: _lodash2.default.pluck(pairs, 'lead')
    };
  });
};

var makeQuery = function makeQuery(broker, blacklist) {
  broker = broker.toJSON();
  var basic = broker.leadFilters.basic;
  var detail = broker.leadFilters.detail;

  var query = {
    creditRating: utils.makeOptionRegex(basic.creditRating, 'creditRatings'),
    'requestedLoan.purpose': utils.makeOptionRegex(basic.loanPurpose, 'loanPurposes'),
    'property.description': utils.makeOptionRegex(basic.propertyType, 'propertyTypes'),
    'address.state': utils.makeRegexFromStates(broker.leadFilters.states),
    _id: { $nin: blacklist }
  };

  if (detail) {
    if (detail.ltv && detail.ltv.use) {
      query.LTV = {
        $gte: detail.ltv.minimum || 0,
        $lte: detail.ltv.maximum || 1
      };
    }

    if (detail.requestedLoanAmount && detail.requestedLoanAmount.use) {
      query['requestedLoan.amountMin'] = {
        $gte: detail.requestedLoanAmount.minimum || 0
      };

      query['requestedLoan.amountMax'] = {
        $lte: detail.requestedLoanAmount.maximum || 1000000
      };
    }

    if (detail.rate && detail.rate.use) {
      var key = 'mortgage.first.rate';
      query[key] = {};
      query[key].$gte = detail.rate.minimum || 0;
      query[key].$lte = detail.rate.maximum || 20;
    }
  }
  return query;
};

var getLeads = function getLeads(_ref) {
  var broker = _ref.broker;
  var blacklist = _ref.blacklist;
  var limit = _ref.limit;
  var skip = _ref.skip;

  var query = makeQuery(broker, blacklist);

  var selection = _leads.Leads.find(query).select('-type -dupeKey').lean();

  if (skip) {
    selection = selection.skip(skip);
  }

  if (limit) {
    selection = selection.limit(limit);
  }

  return selection.stream();
};

OrdersSchema.statics.getCountForPreorder = function (broker) {
  var Orders = _mongoose2.default.model('orders');
  return _brokers.Brokers.findByIdAsync(broker._id).then(getBrokerOrderHistory).then(function (_ref2) {
    var broker = _ref2.broker;
    var blacklist = _ref2.blacklist;

    var query = makeQuery(broker, blacklist);
    return _leads.Leads.count(query);
  });
};

OrdersSchema.statics.preorder = function (broker, _ref3) {
  var limit = _ref3.limit;
  var skip = _ref3.skip;

  return _brokers.Brokers.findByIdAsync(broker._id).then(getBrokerOrderHistory).then(function (opts) {
    opts.limit = limit;
    opts.skip = skip;
    return getLeads(opts);
  });
};

OrdersSchema.statics.saveOrder = function (order) {
  var Order = _mongoose2.default.model('orders');
  var leads = order.leads;
  var broker = order.broker;


  return new Promise(function (yes, no) {
    Order.createAsync({ broker: broker._id }).then(function (order) {
      order.leads = order.leads.concat(leads);
      order.save(function (err, order) {
        err ? no(err) : yes(order);
      });
    });
  });
};

var Orders = exports.Orders = _mongoose2.default.model('orders', OrdersSchema);
var OrdersPair = exports.OrdersPair = _mongoose2.default.model('orderspairs', OrdersPairSchema);