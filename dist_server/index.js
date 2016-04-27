'use strict';

var _require = require('./config/env');

var config = _require.config;

var app = require('./app').default;
var logger = require('./util/logger').logger;

app.listen(config.port, function () {
  logger.log('listening on port ', config.port);
});