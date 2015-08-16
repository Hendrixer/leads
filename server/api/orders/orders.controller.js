import {Orders} from './orders.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Orders);
future.promisifyAll(Orders.prototype);

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
  const {body: order} = req;

  const newOrder = new Orders();
  newOrder.broker = order.broker;

  const {leads} = order;

  newOrder.leads.push(...leads);

  newOrder.save((err, savedOrder) => {
    return err ? next(err) : res.json(savedOrder);
  });
};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



