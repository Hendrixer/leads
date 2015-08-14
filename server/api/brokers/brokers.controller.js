import {Brokers} from './brokers.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Brokers);
future.promisifyAll(Brokers.prototype);

export const $get = (req, res, next)=> {
  Brokers.findAsync()
    .then(brokerss => {
      req.json(brokerss);
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



