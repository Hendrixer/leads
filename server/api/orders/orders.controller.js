import {Orders} from './orders.model';
import _ from 'lodash';
import {Leads} from '../leads/leads.model';
import {Brokers} from '../brokers/brokers.model';
import {logger} from '../../util/logger';

export const $param = (req, res, next, orderId) => {

};

export const $get = (req, res, next)=> {
  Orders.findAsync()
    .then(orderss => {
      req.json(orderss);
    })
    .catch(next.bind.next);
};

export const $getOne = (req, res, next)=> {
  res.json(req.order);
};

export const $post = (req, res, next)=> {
  Orders.createOrder(req.body)
    .then(order => {
      logger.log(order);
      res.json(order);
    })
    .catch(e => {
      logger.error(e);
      res.send(e);
    });
};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



