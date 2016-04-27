'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$destroy = exports.$put = exports.$post = exports.$getOne = exports.$search = exports.$get = exports.$param = undefined;

var _brokers = require('./brokers.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../../util/logger');

var _query = require('../query');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $param = exports.$param = function $param(req, res, next, broker) {
  _brokers.Brokers.findByIdAsync(broker).then(function (foundBroker) {
    if (foundBroker) {
      req.broker = foundBroker || {};
      next();
    }
  }).catch(function (e) {
    next(e);
  });
};

var $get = exports.$get = function $get(req, res, next) {
  if (req.query.count) {
    _brokers.Brokers.count({}).execAsync().then(function (count) {
      res.status(200).send({ count: count });
    });
  } else {
    (0, _query.query)(_brokers.Brokers.find.bind(_brokers.Brokers), req.query).then(function (brokers) {
      res.json(brokers);
    }).catch(next.bind.next);
  }
};

var $search = exports.$search = function $search(req, res, next) {
  var text = req.query.text;

  var reg = new RegExp('^' + text, 'i');
  _brokers.Brokers.find({
    name: reg
  })
  // .select('name displayName email')
  .limit(20).execAsync().then(function (brokers) {
    res.json(brokers);
  }).catch(function (e) {
    next(e);
  });
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {
  res.json(req.broker);
};

var $post = exports.$post = function $post(req, res, next) {
  _brokers.Brokers.createAsync(req.body).then(function (broker) {
    res.json(broker);
  }).catch(next.bind(next));
};

var $put = exports.$put = function $put(req, res, next) {
  var broker = req.broker;
  _lodash2.default.merge(broker, req.body);
  broker.save(function (err, saved) {
    if (err) {
      return next(err);
    }

    res.json(saved);
  });
};

var $destroy = exports.$destroy = function $destroy(req, res, next) {};