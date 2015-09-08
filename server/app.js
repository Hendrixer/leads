import express from 'express';
import appMiddleware from './config/globalMiddleware';
import {api} from './api';
import mongoose from 'mongoose';
import config from './config/env';
import Future from 'bluebird';

Future.promisifyAll(mongoose.Model);
Future.promisifyAll(mongoose.Model.prototype);
Future.promisifyAll(mongoose.Query.prototype);
mongoose.connect(config.db.url);

if (config.db.seed) {
  require('./config/seed');
}

const app = express();

appMiddleware(app);
app.use('/api', api);

export default app;
