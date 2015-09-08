import {Leads} from './leads.model';
import _ from 'lodash';
import spreadToJSon from 'xlsx-to-json';
import fs from 'fs';
import path from 'path';
import future from 'bluebird';
import {logger} from '../../util/logger';
import {query} from '../query';
import {Converter} from 'csvtojson';

const toJson = future.promisify(spreadToJSon);

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
  const pathToFile = path.join(__dirname, '/../../../', req.files[0].path);
  const stream = fs.createReadStream(pathToFile);
  const convertor = new Converter({ constructResult: true });
  const leads = [];

  convertor.on('end_parsed', () => {
    // res.json({ok: true});
    logger.log('done');
    logger.log('leads ', leads.length);
  });

  convertor.on('record_parsed', lead => {
    Leads.saveDupe(lead)
      .then(lead => {
        leads.push(lead);
      })
      .catch(e => {
        logger.error(e);
      });
  });

  stream.pipe(convertor);

  res.send({ok: true});

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

export const $put = (req, res, next)=> {

};

export const $destroy = (req, res, next)=> {

};
