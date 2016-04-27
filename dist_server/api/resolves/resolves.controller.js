'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$destroy = exports.$put = exports.$post = exports.$getOne = exports.$get = exports.$param = undefined;

var _resolves = require('./resolves.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_resolves.Resolves);
_bluebird2.default.promisifyAll(_resolves.Resolves.prototype);
_bluebird2.default.promisifyAll(_resolves.ResolvesSession);
_bluebird2.default.promisifyAll(_resolves.ResolvesSession.prototype);

var $param = exports.$param = function $param(req, res, next, id) {
  _resolves.ResolvesSession.findById(id).populate({
    path: 'resolves',
    select: 'lead dupe'
  }).then(function (resolve) {
    req.resolution = resolve;
    next();
  }).catch(function (e) {
    next(e);
  });
};

var $get = exports.$get = function $get(req, res, next) {
  _resolves.Resolves.findAsync().then(function (resolves) {
    req.json(resolves);
  }).catch(next.bind.next);
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {
  res.json(req.resolution);
};

var $post = exports.$post = function $post(req, res, next) {};

var $put = exports.$put = function $put(req, res, next) {};

var $destroy = exports.$destroy = function $destroy(req, res, next) {
  _resolves.Resolves.findByIdAndRemoveAsync(req.resolution._id).then(function (resolution) {
    res.json(resolution);
  }).catch(function (e) {
    next(e);
  });
};