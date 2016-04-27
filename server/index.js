require('babel/register');

var config = require('./config/env');
var app = require('./app');
var logger = require('./util/logger').logger;

app.listen(config.port, function() {
  logger.log('listening on port ', config.port);
});
