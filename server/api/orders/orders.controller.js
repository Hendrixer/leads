import {Orders} from './orders.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Orders);
future.promisifyAll(Orders.prototype);

export const $get = (req, res, next)=> {
  Orders.findAsync()
    .then(orderss => {
      req.json(orderss);
    })
    .catch(next.bind.next);
};

export const $getOne = (req, res, next)=> {

};

export const $post = (req, res, next)=> {

};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



