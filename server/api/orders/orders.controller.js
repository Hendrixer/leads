import {Orders, OrdersPair} from './orders.model';
import _ from 'lodash';
import {Leads} from '../leads/leads.model';
import {Brokers} from '../brokers/brokers.model';
import {logger} from '../../util/logger';
import * as utils from '../constants';
import JsonStream from 'JSONStream';
import jsonToCsv from 'json-csv';
import es from 'event-stream';
import uuid from 'node-uuid';

export const $param = (req, res, next, orderId) => {
  Orders.findById(orderId)
  .select('')
  .then(order => {
    if (!order) {
      res.status(404).end();
    } else {
      req.order = order;
      next();
    }
  })
  .catch(e => {
    next('ERROR', e);
  });
};

export const $getOrderPair = (req, res, next) => {
  const {limit=0, skip=0} = req.query;
  logger.log(limit, skip, req.params.order);
  OrdersPair.find({
    order: req.params.order
  })
  .populate('lead')
  .select('lead')
  .limit(limit)
  .skip(skip)
  .execAsync()
  .then(orders => {
    res.json(_.pluck(orders, 'lead'));
  })
  .catch(e => {
    next(e);
  });
};

export const $getForBroker = (req, res, next)=> {
  Orders.find({broker: req.query.broker}).lean()
    .execAsync()
    .then(orders => {
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
  // const orderNumber = uuid.v4();
  Orders.createAsync({
    // orderNumber,
    broker: req.body.broker._id,
    leadsOrdered: req.body.leadsOrdered
  })
  .then(order => {
    res.json(order);
  })
  .catch(e => {
    next(e);
  });
};

export const $put = (req, res, next)=> {
  const order = req.order;
  if (req.body.leads) {
    req.body.leads = order.leads.concat(req.body.leads);
  }

  _.merge(order, req.body);

  order.save((err, saved) => {
    err ? next(err) : res.json({_id: saved._id});
  });
};

export const $batchOrderPairs = (req, res, next) => {
  const brokerId = req.params.broker;
  const {leads, orderId} = req.body;
  OrdersPair.createAsync(_.map(leads, lead => {
    return {
      lead,
      broker: brokerId,
      order: orderId
    };
  }))
  .then(created => {
    logger.log(`created ${created.length} orders`);
    res.json({ok: true});
  })
  .catch(e => {
    next(e);
  });

  // Orders.findByIdAndUpdateAsync(req.params.broker, {
  //   $push: { leads: { $each: req.body.leads }}
  // }, {select: '_id' })
  // .then(order => {
  //   res.json(order);
  // })
  // .catch(e => {
  //   next(e);
  // });
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
    cb(null, es.readArray(data.leads));
  }))
  .pipe(jsonToCsv.csv({headers: utils.csvHeaders}))
  .pipe(res);
};
