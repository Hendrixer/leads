import express from 'express';
import appMiddleware from './config/globalMiddleware';
import {api} from './api';
import mongoose from 'mongoose';
import config from './config/env';
import Future from 'bluebird';
// import memwatch from 'memwatch-next';
import util from 'util';
// import heapdump from 'heapdump';

// memwatch.on('leak', info => {
//   console.error(info);
//   heapdump.writeSnapshot((error, filenmae) => {
//     if (error) {
//       console.error(err);
//     } else {
//       console.log('saved snapshot ' + filenmae);
//     }
//   });
// });

Future.promisifyAll(mongoose.Model);
Future.promisifyAll(mongoose.Model.prototype);
Future.promisifyAll(mongoose.Query.prototype);
mongoose.connect(config.db.url);

// if (config.db.seed) {
//   require('./config/seed');
// }

const app = express();

appMiddleware(app);
app.use('/api', api);

export default app;
