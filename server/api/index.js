import express from 'express';
import admin from './admins/admins.routes';
import brokers from './brokers/brokers.routes';
import leads from './leads/leads.routes';
import orders from './orders/orders.routes';

const api = express.Router();

api.use('/admins', admin);
api.use('/brokers', brokers);
api.use('/leads', leads);
api.use('/orders', orders);

export {api};
