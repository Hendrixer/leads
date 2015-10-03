import {Orders} from './orders.model';
import _ from 'lodash';
import {Leads} from '../leads/leads.model';
import {Brokers} from '../brokers/brokers.model';
import {logger} from '../../util/logger';
import * as utils from '../constants';
import JsonStream from 'JSONStream';
import jsonToCsv from 'json-csv';
import es from 'event-stream';

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
      next(e);
    });
};

export const $getOne = (req, res, next)=> {
  res.json(req.order);
};

export const $preorder = (req, res, next) => {
  const broker = {_id: req.query.broker};
  if (req.query.count) {
    return Orders.getCountForPreorder(broker)
    .then(count => {
      logger.log('count', count);
      res.json({count});
    })
    .catch(e => {
      next(e);
    });
  }

  Orders.preorder(broker, req.query)
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
  // const mimeType = req.query.filetype;
  // oly support csvs for now
  // if (/text|txt|pdf/g.test(mimeType)) {
  //   return res.send({message: `${mimeType} files not supoorted yet!`});
  // }

  Orders.createOrder(req.body)
  .then(order => {
    res.json(order);
  })
  .catch(e => {
    next(e);
  });

  // Orders.createOrder({_id: req.query.broker})
  //   .then(data => {
  //     if (data.message) {
  //       res.json(data.message);
  //     } else {
  //       utils.downloadFile(res, req.query.filetype, data);
  //     }
  //   })
  //   .catch(e => {
  //     // logger.error('error', e);
  //     console.error(e);
  //     res.send(e);
  //   });
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

  res.attachment(new Date().toLocaleDateString().replace(/\//g, '-') + '.csv');
  Orders.findById(req.query.order)
  .populate('leads')
  .select('leads')
  .stream()
  .pipe(es.map((data, cb) => {
    logger.log(data.leads.length);
    cb(null, es.readArray(data.leads));
  }))
  .pipe(jsonToCsv.csv({headers: utils.csvHeaders}))
  .pipe(res);

  // .then(order => {
  //   utils.downloadFile(res, req.query.filetype, order);
  // })
  // .catch(e => {
  //   next(e);
  // });
};
