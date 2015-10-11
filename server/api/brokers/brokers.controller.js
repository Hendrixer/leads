import {Brokers} from './brokers.model';
import _ from 'lodash';
import {logger} from '../../util/logger';
import {query} from '../query';

export const $param = (req, res, next, broker) => {
  Brokers.findByIdAsync(broker)
    .then(foundBroker => {
      if (foundBroker) {
        req.broker = foundBroker || {};
        next();
      }
    })
    .catch(e => {
      next(e);
    });
};

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

export const $search = (req, res, next) => {
  const {text} = req.query;
  const reg = new RegExp(`^${text}`, 'i');
  Brokers.find({
    name: reg
  })
  // .select('name displayName email')
  .limit(20)
  .execAsync()
  .then(brokers => {
    res.json(brokers);
  })
  .catch(e => {
    next(e);
  });
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
  const broker = req.broker;
  _.merge(broker, req.body);
  broker.save((err, saved) => {
    if (err) {
      return next(err);
    }

    res.json(saved);
  });
};

export const $destroy = (req, res, next)=> {

};
