'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _env = require('./config/env');

var _logger = require('./util/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app2.default.listen(_env.config.port, function () {
  _logger.logger.log('listening on port ', _env.config.port);
});