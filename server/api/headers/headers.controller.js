import {Headers} from './headers.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Headers);
future.promisifyAll(Headers.prototype);

export const $get = (req, res, next)=> {
  Headers.findAsync()
    .then(headerss => {
      req.json(headerss);
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



