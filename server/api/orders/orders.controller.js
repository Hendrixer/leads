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
  Orders.createAsync({broker: req.body.broker._id})
  .then(order => {
    order.leads = req.body.leads;
    order.save((err, saved) => {
      err ? next(err) : res.json({_id: saved._id});
    });
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

export const $updateLeads = (req, res, next) => {
  Orders.findByIdAndUpdateAsync(req.params.broker, {
    $push: { leads: { $each: req.body.leads }}
  }, {select: '_id' })
  .then(order => {
    res.json(order);
  })
  .catch(e => {
    next(e);
  });
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
