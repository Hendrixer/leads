import express from 'express';
import appMiddleware from './config/globalMiddleware';
import {api} from './api';
import mongoose from 'mongoose';
import config from './config/env';

mongoose.connect(config.db.url);
const app = express();

appMiddleware(app);

app.use('/api', api);

export default app;



