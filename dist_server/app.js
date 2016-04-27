'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _globalMiddleware = require('./config/globalMiddleware');

var _globalMiddleware2 = _interopRequireDefault(_globalMiddleware);

var _api = require('./api');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./config/env');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logger = require('./util/logger');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_mongoose2.default.Model);
_bluebird2.default.promisifyAll(_mongoose2.default.Model.prototype);
_bluebird2.default.promisifyAll(_mongoose2.default.Query.prototype);
_mongoose2.default.connect(_env.config.db.url);

if (_env.config.db.seed) {
  require('./config/seed');
}

var app = (0, _express2.default)();

(0, _globalMiddleware2.default)(app);
app.get('/status', function (req, res) {
  return res.send({ ok: true });
});
app.use('/api', _api.api);

exports.default = app;