'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$signin = exports.$destroy = exports.$put = exports.$post = exports.$getOne = exports.$get = undefined;

var _admins = require('./admins.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _auth = require('../../util/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_admins.Admins);
_bluebird2.default.promisifyAll(_admins.Admins.prototype);

var $get = exports.$get = function $get(req, res, next) {
  _admins.Admins.findAsync().then(function (adminss) {
    req.json(adminss);
  }).catch(next.bind.next);
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {
  _admins.Admins.findById(req.user._id).then(function (admin) {
    res.json(admin);
  }).catch(function (e) {
    next(e);
  });
};

var $post = exports.$post = function $post(req, res, next) {
  res.json({ token: (0, _auth.signToken)(req.admin._id) });
};

var $put = exports.$put = function $put(req, res, next) {
  var admin = req.user;
  _admins.Admins.findByIdAndUpdate(admin._id, req.body, { new: true }).then(function (admin) {
    res.json(admin);
  }).catch(function (e) {
    next(e);
  });
};

var $destroy = exports.$destroy = function $destroy(req, res, next) {};

var $signin = exports.$signin = function $signin(req, res, next) {
  res.json({ token: (0, _auth.signToken)(req.admin._id) });
};