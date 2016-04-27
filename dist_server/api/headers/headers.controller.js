'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$destroy = exports.$put = exports.$post = exports.$getOne = exports.$get = undefined;

var _headers = require('./headers.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('../../util/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_headers.Headers);
_bluebird2.default.promisifyAll(_headers.Headers.prototype);

var $get = exports.$get = function $get(req, res, next) {
  var broker = req.query.broker;

  _headers.Headers.findOneAsync({ broker: broker }).then(function () {
    var header = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    res.json(header);
  }).catch(function (e) {
    next(e);
  });
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {};

var $post = exports.$post = function $post(req, res, next) {};

var $put = exports.$put = function $put(req, res, next) {
  var broker = req.body.broker;
  _headers.Headers.findOneAndUpdateAsync({ broker: broker }, req.body, { upsert: true, new: true }).then(function (header) {
    res.json(header);
  }).catch(function (e) {
    next(e);
  });
};

var $destroy = exports.$destroy = function $destroy(req, res, next) {};