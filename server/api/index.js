import express from 'express';
import admin from './admins/admins.routes';
import brokers from './brokers/brokers.routes';
import leads from './leads/leads.routes';
import orders from './orders/orders.routes';
import resolves from './resolves/resolves.routes';
import headers from './headers/headers.routes';
import notes from './notes/notes.routes';
import {isAuth} from '../util/auth';
import Firebase from 'firebase';
import { config } from '../config/env';

const jobStream = new Firebase(config.fireRef);
const api = express.Router();

api.use('/admins', admin);
api.use('/brokers', isAuth(), brokers);
api.use('/leads', isAuth(), leads);
api.use('/orders', isAuth(), orders);
api.use('/resolves', isAuth(), resolves);
api.use('/headers', isAuth(), headers);
api.use('/notes', isAuth(), notes);
api.get('/jobs', isAuth(), (req, res) => {
  jobStream.push({filename: req.query.filename});
  res.send({ok: true});
});

export {api};
