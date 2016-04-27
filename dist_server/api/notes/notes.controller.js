'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$destroy = exports.$put = exports.$post = exports.$getOne = exports.$getByBroker = exports.$get = undefined;

var _notes = require('./notes.model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_notes.Notes);
_bluebird2.default.promisifyAll(_notes.Notes.prototype);

var $get = exports.$get = function $get(req, res, next) {
  _notes.Notes.findAsync().then(function (notess) {
    res.json(notess);
  }).catch(next.bind.next);
};

var $getByBroker = exports.$getByBroker = function $getByBroker(req, res, next) {
  var broker = req.query.broker;

  _notes.Notes.findAsync({ broker: broker }).then(function (notes) {
    res.json(notes);
  }).catch(next.bind(next));
};

var $getOne = exports.$getOne = function $getOne(req, res, next) {};

var $post = exports.$post = function $post(req, res, next) {
  _notes.Notes.createAsync(req.body).then(function (note) {
    res.json(note);
  }).catch(function (e) {
    next(e);
  });
};

var $put = exports.$put = function $put(req, res, next) {};

var $destroy = exports.$destroy = function $destroy(req, res, next) {};