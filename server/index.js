import app       from './app';
import {config}  from './config/env';
import {logger}  from './util/logger';

app.listen(config.port, function() {
  logger.log('listening on port ', config.port);
});
