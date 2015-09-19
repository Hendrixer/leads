import {Orders} from './orders.model';
import _ from 'lodash';
import {Leads} from '../leads/leads.model';
import {Brokers} from '../brokers/brokers.model';
import {logger} from '../../util/logger';
import * as utils from '../constants';
import JsonStream from 'JSONStream';

export const $param = (req, res, next, orderId) => {
};

export const $getForBroker = (req, res, next)=> {
  Orders.find({broker: req.query.broker}).lean()
    .execAsync()
    .then(orders => {
      orders = _.map(orders, order => {
        const {length} = order.leads;
        order.leads = length;
        return order;
      });
      res.json(orders);
    })
    .catch(e=> {
      res.send(e);
    });
};

export const $getOne = (req, res, next)=> {
  res.json(req.order);
};

export const $preorder = (req, res, next) => {
  const broker = {_id: req.query.broker};
  Orders.preorder(broker)
  .then(stream => {
    stream
    .pipe(JsonStream.stringify())
    .pipe(res);
  })
  .catch(e => {
    next(e);
  });
};

export const $create = (req, res, next)=> {
  const mimeType = req.query.filetype;

  // oly support csvs for now
  if (/text|txt|pdf/g.test(mimeType)) {
    return res.send({message: `${mimeType} files not supoorted yet!`});
  }

  Orders.createOrder({_id: req.query.broker})
    .then(data => {
      if (data.message) {
        res.json(data.message);
      } else {
        utils.downloadFile(res, req.query.filetype, data);
      }
    })
    .catch(e => {
      // logger.error('error', e);
      console.error(e);
      res.send(e);
    });
};

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};

export const $redownload = (req, res, next) => {
  const mimeType = req.query.filetype;

  // oly support csvs for now
  if (/text|txt|pdf/g.test(mimeType)) {
    return res.send({message: `${mimeType} files not supoorted yet!`});
  }

  Orders.findById(req.query.order)
  .populate('leads broker')
  .execAsync()
  .then(order => {
    utils.downloadFile(res, req.query.filetype, order);
  })
  .catch(e => {
    res.send(e);
  });
};
