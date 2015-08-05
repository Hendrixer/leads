import express from 'express';
import appMiddleware from './config/globalMiddleware';
import spreadToJSon from 'xlsx-to-json';
import {api} from './api';

const app = express();

appMiddleware(app);

app.use('/api', api);

export default app;



