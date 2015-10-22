import {Notes} from './notes.model';
import _ from 'lodash';
import future from 'bluebird';

future.promisifyAll(Notes);
future.promisifyAll(Notes.prototype);

export const $get = (req, res, next)=> {
  Notes.findAsync()
    .then(notess => {
      req.json(notess);
    })
    .catch(next.bind.next);
};

export const $getByBroker = (req, res, next) => {
  const broker = req.query.broker;

  Notes.findAsync({broker})
  .then(notes => {
    res.json(notes);
  })
  .catch(next.bind(next));
};

export const $getOne = (req, res, next)=> {

};

export const $post = (req, res, next)=> {

};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};
