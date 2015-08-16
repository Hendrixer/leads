import {Brokers} from './brokers.model';
import _ from 'lodash';

export const $get = (req, res, next)=> {
  Brokers.findAsync()
    .then(brokers => {
      res.json(brokers);
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



