import {Leads} from './leads.model';
import _ from 'lodash';
import spreadToJSon from 'xlsx-to-json';
import fs from 'fs';
import path from 'path';
import future from 'bluebird';
import {logger} from '../../util/logger';
import {query} from '../query';
import aws from 'aws-sdk';
import { config }  from '../../config/env';


const toJson = future.promisify(spreadToJSon);

export const $sign = (req, res, next) => {
  aws.config.update({
    accessKeyId: config.secrets.awsAccessKeyId,
    secretAccessKey: config.secrets.awsSecretAccessKey
  });
  const stamp = Date.now();
  const filename = `${req.query.filename}-${stamp}`;
  const s3 = new aws.S3();
  const s3Params = {
    Bucket: config.secrets.awsS3Bucket,
    Key: filename,
    Expires: 60,
    ContentType: req.query.filetype,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      next(err);
    } else {
      const resp = {
        filename,
        signed_request: data,
        url: `https://${config.secrets.awsS3Bucket}.s3.amazonaws.com/${filename}`
      };
      res.json(resp);
    }
  });
};

export const $supress = (req, res, next) => {
  const findDupes = Promise.all(req.body.numbers.map(number => {
    // number = number.replace(/-/g, '');
    // number = parseInt(number);
    if (_.isFinite(number)) {
      return Leads.isThere(number);
    } else {
      return false;
    }
  }))
  .then(checks => {
    console.log(checks);
    const count = _.size(_.compact(checks));
    res.json({dupes: count});
  })
  .catch(e => {
    next(e);
  });
};

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
  res.send({ok: true});
};

export const $putMany = (req, res, next) => {
  const queue = Promise.all(_.map(req.body.leads, lead => {
    return Leads.findOneAndUpdateAsync({
      $or: [{email: lead.email}, {dupeKey: lead.dupeKey}]
    }, lead);
  }));

  queue.then(leads => {
    res.json({ok: true});
  })
  .catch(e => {
    next(e);
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
    res.json(leads);
  })
  .catch(e => {
    next(e);
  });
};
