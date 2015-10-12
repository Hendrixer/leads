import {Headers} from './headers.model';
import _ from 'lodash';
import future from 'bluebird';
import {logger} from '../../util/logger';

future.promisifyAll(Headers);
future.promisifyAll(Headers.prototype);

export const $get = (req, res, next)=> {
  const broker = req.query.broker;

  Headers.findOneAsync({broker})
  .then((header={}) => {
    res.json(header);
  })
  .catch(e => {
    next(e);
  });
};

export const $getOne = (req, res, next)=> {
  
};

export const $post = (req, res, next)=> {

};

export const $put = (req, res, next)=> {
  const broker = req.body.broker;
  Headers.findOneAndUpdateAsync(
    {broker},
    req.body,
    {upsert: true, new: true}
  )
  .then(header => {
    res.json(header);
  })
  .catch(e => {
    next(e);
  });
};

export const $destroy = (req, res, next)=> {

};
