import {Leads} from './leads.model';
import _ from 'lodash';
import spreadToJSon from 'xlsx-to-json';
import fs from 'fs';
import path from 'path';
import future from 'bluebird';
import {logger} from '../../util/logger';
import {query} from '../query';
import {Publisher} from '../../util/message';
import aws from 'aws-sdk';
import config from '../../config/env';
const publisher = new Publisher();

const toJson = future.promisify(spreadToJSon);

export const $sign = (req, res, next) => {
  aws.config.update({
    accessKeyId: config.secrets.awsAccessKeyId,
    secretAccessKey: config.secrets.awsSecretAccessKey
  });
  const stamp = new Date().toLocaleDateString().replace(/\//g, '-');
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
        signed_request: data,
        url: `https://${config.secrets.awsS3Bucket}.s3.amazonaws.com/${filename}`
      };
      res.json(resp);
    }
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
  publisher.queueJob('csv', {files: req.files});

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
