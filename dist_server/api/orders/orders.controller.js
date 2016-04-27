'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$redownload = exports.$destroy = exports.$batchOrderPairs = exports.$put = exports.$create = exports.$preorder = exports.$getOne = exports.$getForBroker = exports.$getOrderPair = exports.$param = undefined;

var _orders = require('./orders.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _leads = require('../leads/leads.model');

var _brokers = require('../brokers/brokers.model');

var _logger = require('../../util/logger');

var _constants = require('../constants');

var utils = _interopRequireWildcard(_constants);

var _JSONStream = require('JSONStream');

var _JSONStream2 = _interopRequireDefault(_JSONStream);

var _jsonCsv = require('json-csv');

var _jsonCsv2 = _interopRequireDefault(_jsonCsv);

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $param = exports.$param = function $param(req, res, next, orderId) {
  _orders.Orders.findById(orderId).select('').then(function (order) {
    if (!order) {
      res.status(404).end();
    } else {
      req.order = order;
      next();
    }
  }).catch(function (e) {
    next('ERROR', e);
  });
};

var $getOrderPair = exports.$getOrderPair = function $getOrderPair(req, res, next) {
  var _req$query = req.query;
  var _req$query$limit = _req$query.limit;
  var limit = _req$query$limit === undefined ? 0 : _req$query$limit;
  var _req$query$skip = _req$query.skip;
  var skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  _logger.logger.log(limit, skip, req.params.order);
  _orders.OrdersPair.find({
    order: req.params.order
  }).populate('lead').select('lead').limit(limit).skip(skip).execAsync().then(function (orders) {
    res.json(_lodash2.default.pluck(orders, 'lead'));
  }).catch(function (e) {
    next(e);
  });
};

var $getForBroker = exports.$getForBroker = function $getForBroker(req, res, next) {
  _orders.Orders.find({ broker: req.query.broker }).lean().execAsync().then(function (orders) {
    res.json(orders);
  }).catch(function (e) {
    next(e);
  });
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {
  res.json(req.order);
};

var $preorder = exports.$preorder = function $preorder(req, res, next) {
  var broker = { _id: req.query.broker };
  if (req.query.count) {
    return _orders.Orders.getCountForPreorder(broker).then(function (count) {
      res.json({ count: count });
    }).catch(function (e) {
      next(e);
    });
  }

  _orders.Orders.preorder(broker, req.query).then(function (stream) {
    stream.pipe(_JSONStream2.default.stringify()).pipe(res);
  }).catch(function (e) {
    next(e);
  });
};

var $create = exports.$create = function $create(req, res, next) {
  // const orderNumber = uuid.v4();
  _orders.Orders.createAsync({
    // orderNumber,
    broker: req.body.broker._id,
    leadsOrdered: req.body.leadsOrdered
  }).then(function (order) {
    res.json(order);
  }).catch(function (e) {
    next(e);
  });
};

var $put = exports.$put = function $put(req, res, next) {
  var order = req.order;
  if (req.body.leads) {
    req.body.leads = order.leads.concat(req.body.leads);
  }

  _lodash2.default.merge(order, req.body);

  order.save(function (err, saved) {
    err ? next(err) : res.json({ _id: saved._id });
  });
};

var $batchOrderPairs = exports.$batchOrderPairs = function $batchOrderPairs(req, res, next) {
  var brokerId = req.params.broker;
  var _req$body = req.body;
  var leads = _req$body.leads;
  var orderId = _req$body.orderId;

  _orders.OrdersPair.createAsync(_lodash2.default.map(leads, function (lead) {
    return {
      lead: lead,
      broker: brokerId,
      order: orderId
    };
  })).then(function (created) {
    _logger.logger.log('created ' + created.length + ' orders');
    res.json({ ok: true });
  }).catch(function (e) {
    next(e);
  });

  // Orders.findByIdAndUpdateAsync(req.params.broker, {
  //   $push: { leads: { $each: req.body.leads }}
  // }, {select: '_id' })
  // .then(order => {
  //   res.json(order);
  // })
  // .catch(e => {
  //   next(e);
  // });
};

var $destroy = exports.$destroy = function $destroy(req, res, next) {};

var $redownload = exports.$redownload = function $redownload(req, res, next) {
  var mimeType = req.query.filetype;

  // oly support csvs for now
  if (/text|txt|pdf/g.test(mimeType)) {
    return res.send({ message: mimeType + ' files not supoorted yet!' });
  }

  res.attachment(new Date().toLocaleDateString().replace(/\//g, '-') + '.csv');
  _orders.Orders.findById(req.query.order).populate('leads').select('leads').stream().pipe(_eventStream2.default.map(function (data, cb) {
    cb(null, _eventStream2.default.readArray(data.leads));
  })).pipe(_jsonCsv2.default.csv({ headers: utils.csvHeaders })).pipe(res);
};