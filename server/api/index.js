import express from 'express';
import {admin} from './admin';
import {brokers} from './brokers';
import {leads} from './leads';
import {orders} from './orders';

const api = express.Router();

api.use('/admin', admin);
api.use('/brokers', brokers);
api.use('/leads', leads);
api.use('/orders', orders);

export {api};
