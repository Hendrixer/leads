import {Leads} from './leads.model';
import _ from 'lodash';
import spreadToJSon from 'xlsx-to-json';
import fs from 'fs';
import path from 'path';
import future from 'bluebird';
import {logger} from '../../util/logger';
import {query} from '../query';
import pusher from '../../util/pusher';

// import {Converter} from 'csvtojson';
import CombineStream from 'combined-stream';
import parseCsv from '../../util/parseCsv';
const toJson = future.promisify(spreadToJSon);

export const $param = (req, res, next, id) => {
  Leads.findByIdAsync(id)
  .then(lead => {
    req.lead = lead || {};
    next();
  })
  .catch(e => {
    next(e);
  });
};

export const $search = (req, res, next) => {
  const {text} = req.query;
  Leads.find(
    {$text: { $search: text }},
    {score: { $meta: 'textScore'}}
  )
  .sort({
    score: {
      $meta: 'textScore'
    }
  })
  .select('firstName lastName email address')
  .lean()
  .execAsync()
  .then(leads => {
    res.json(leads);
  })
  .catch(e => {
    next(e);
  });
};

export const $get = (req, res, next)=> {
  if (req.query.count) {
    Leads.count({})
      .execAsync()
      .then(count => {
        res.status(200).send({count});
      });
  } else {
    query(Leads.find.bind(Leads), req.query)
      .then(leads => {
        res.json(leads);
      })

      .catch(next.bind.next);
  }
};

export const $getOne = (req, res, next)=> {

};

export const $post = (req, res, next)=> {
  const mergedStream = CombineStream.create();
  logger.log(req.files[0]);
  _.map(req.files, file => {
    const pathToFile = path.join(__dirname, '/../../../', file.path);
    return fs.createReadStream(pathToFile);
  })
  .forEach(stream => {
    mergedStream.append(stream);
  });

  parseCsv(mergedStream, res);

  // res.send({ok: true});

  // toJson({
  //   input:  req.files[0].path,
  //   output: null,
  // })
  //   .then(rawLeads => {
  //     const leads = rawLeads.map(lead => {
  //       return lead = Leads.format(lead);
  //
  //       return Leads.createAsync(lead);
  //     });
  //
  //     return future.all(leads);
  //   })
  //
  //   .then(leads => {
  //     res.json(leads);
  //   })
  //
  //   .catch(next.bind(next));
};

export const $putMany = (req, res, next) => {
  const queue = Promise.all(_.map(req.body.leads, lead => {
    return Leads.findOneAndUpdateAsync({
      $or: [{email: lead.email}, {dupeKey: lead.dupeKey}]
    }, {new: true});
  }));

  queue.then(leads => {
    res.json(leads);
  });
};

export const $put = (req, res, next)=> {
  _.merge(req.lead, req.body);
  req.lead.save((err, saved) => {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  });
};

export const $destroyMany = (req, res, next)=> {
  const leads = req.query.leads.split(',');

  Leads.removeAsync({_id: {$in: leads}})
  .then(leads => {
    logger.log(leads);
    res.json(leads);
  })
  .catch(e => {
    next(e);
  });
};
