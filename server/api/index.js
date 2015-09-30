import express from 'express';
import admin from './admins/admins.routes';
import brokers from './brokers/brokers.routes';
import leads from './leads/leads.routes';
import orders from './orders/orders.routes';
import resolves from './resolves/resolves.routes';
import {isAuth} from '../util/auth';
import raygun from '../util/raygun';

const api = express.Router();

api.use('/admins', admin);
api.use('/brokers', isAuth(), brokers);
api.use('/leads', isAuth(), leads);
api.use('/orders', isAuth(), orders);
api.use('/resolves', isAuth(), resolves);
api.use(raygun.expressHandler);

export {api};
