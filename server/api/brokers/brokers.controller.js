import {Brokers} from './brokers.model';
import _ from 'lodash';
import {logger} from '../../util/logger';
import {query} from '../query';

export const $get = (req, res, next)=> {
  if (req.query.count) {
    Brokers.count({})
      .execAsync()
      .then(count => {
        res.status(200).send({count});
      });
  } else {
    query(Brokers.find.bind(Brokers), req.query)
      .then(brokers => {
        res.json(brokers);
      })
      .catch(next.bind.next);
  }
};

export const $getOne = (req, res, next)=> {
  res.json(req.broker);
};

export const $post = (req, res, next)=> {
  Brokers.createAsync(req.body)
    .then(broker => {
      res.json(broker);
    })
    .catch(next.bind(next));
};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};



