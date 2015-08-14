require('babel/register');
var config = require('./config/env');
var app = require('./app');
var logger = require('./util/logger');

app.listen(config.port, function() {
  logger.print('listening on post %d', config.port);
});
