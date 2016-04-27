import express from 'express';
import appMiddleware from './config/globalMiddleware';
import {api} from './api';
import mongoose from 'mongoose';
import config from './config/env';
import Future from 'bluebird';
import {logger} from './util/logger';
import util from 'util';

Future.promisifyAll(mongoose.Model);
Future.promisifyAll(mongoose.Model.prototype);
Future.promisifyAll(mongoose.Query.prototype);
mongoose.connect(config.db.url);

if (config.db.seed) {
  require('./config/seed');
}

const app = express();

appMiddleware(app);
app.get('/status', (req, res) => res.send({ok: true}))
app.use('/api', api);

export default app;
