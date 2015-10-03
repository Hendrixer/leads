import {Leads} from '../api/leads/leads.model';
import {logger} from './logger';
import csvParser from 'csv-parser';
import CombineStream from 'combined-stream';
import sendMail from './email';
import config from '../config/env';
import {Resolves} from '../api/resolves/resolves.model';
import _ from 'lodash';
import Future from 'bluebird';
import fs from 'fs';
import path from 'path';

let $dupes = [];
let $parsedLeadsCount = 0;
let $leadsSaved = 0;
let $leadsTried = 0;
let $doneParsing = false;
let $inProgress = false;

const resetClosure = ()=> {
  $dupes = [];
  $parsedLeadsCount = 0;
  $leadsSaved = 0;
  $leadsTried = 0;
  $doneParsing = false;
  $inProgress = false;
};

const sendUploadEmail = (resolveId, stats) => {
  let duration = (Date.now() - stats.start) / 1000 + ' seconds';
  const opts = {
    duration,
    uploaded: $parsedLeadsCount,
    saved: $leadsSaved,
    dupes: $dupes.length
  };

  if (resolveId) {
    opts.dupeLink = `${config.appUrl}/#/resolve/${resolveId}`;
  }

  return sendMail('upload', opts)
  .then(i => {
    logger.log('email sent', i);
  })
  .catch(e => {
    logger.error(e, 'mail error');
  })
  .finally(()=> {
    resetClosure();
  });
};

const getDupeKey = (lead) => {
  if (lead.email) {
    lead.email = lead.email.toLowerCase();
  }

  if (lead.lastName) {
    lead.lastName = lead.lastName.toLowerCase();
  }

  lead.firstName = lead.firstName.toLowerCase();

  return `${lead.firstName}${lead.lastName}${lead.email}`;
};

const afterMath = (stats)=> {
  logger.log('$dupes', $dupes.length);
  logger.log('leads count', $parsedLeadsCount);
  logger.log('leads saved', $leadsSaved);
  logger.log('leads tried', $leadsTried);

  if ($dupes.length) {
    const resolve = new Resolves({});
    return Promise.all(_.map($dupes, dupe => {
      const dupeKey = getDupeKey(dupe);
      return Leads.findOneAsync({
        $or: [{email: dupe.email}, {dupeKey}]
      })
      .then(lead => {
        lead = lead || {};
        return lead;
      });
    }))
    .then(matchingLeads => {
      const dupePairs = _.map(matchingLeads, (lead, i) => {
        return {dupe: $dupes[i], alike: lead};
      });
      return new Promise((yes, no) => {
        resolve.dupes = dupePairs;
        resolve.save((err, savedResolved) => {
          if (err) {
            no(err);
          } else {
            yes(savedResolved._id);
          }
        });
      });
    })
    .then(id => {
      return sendUploadEmail(id, stats);
    })
    .catch(e => {
      logger.error(e, 'matchingLeads');
    });
  } else {
    return sendUploadEmail(null, stats);
  }
};

const getStream  = (files) => {
  const mergedStream = CombineStream.create();
  _.map(files, file => {
    const pathToFile = path.join(__dirname, '../../', file.path);

    return fs.createReadStream(pathToFile);
  })
  .forEach(stream => {
    mergedStream.append(stream);
  });

  return mergedStream;
};

const parseCsv = (job) => {

  const stream = getStream(job.data.files);
  return new Future((yes, no) => {
    const startTime = Date.now();

    stream.pipe(csvParser())
    .on('data', row => {
      $inProgress = true;
      $parsedLeadsCount++;
      Leads.saveDupe(row)
      .then(data => {
        $leadsTried++;
        if (data.type === 'dupe') {
          $dupes.push(data.lead);
        } else {
          $leadsSaved++;
        }

        if ($leadsTried === $parsedLeadsCount && $doneParsing) {
          $doneParsing = false;
          yes(afterMath({
            start: startTime
          }));
        }
      })
      .catch(error => {
        logger.error(error, 'Lead Save Error');
        console.error(error);
        $leadsTried++;

        if ($leadsTried === $parsedLeadsCount && $doneParsing) {
          $doneParsing = false;
          yes(afterMath({
            start: startTime
          }));
        }
      });
    })
    .on('end', ()=> {
      $doneParsing = true;
    });
  });
};

export default parseCsv;
