import {Admins} from './admins.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Admins);
future.promisifyAll(Admins.prototype);

export const $get = (req, res, next)=> {
  Admins.findAsync()
    .then(adminss => {
      req.json(adminss);
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



