require('babel/register');
if (process.env.NODE_ENV === 'production') {
  require('newreilc');
}

var config = require('./config/env');
var app = require('./app');
var logger = require('./util/logger').logger;

app.listen(config.port, function() {
  logger.log('listening on port ', config.port);
});
