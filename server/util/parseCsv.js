import {Leads} from '../api/leads/leads.model';
import {logger} from './logger';
import csvParser from 'csv-parser';
import CombineStream from 'combined-stream';
import sendMail from './email';
import config from '../config/env';
import {Resolves} from '../api/resolves/resolves.model';
import _ from 'lodash';

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
    logger.error('mail error', e);
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
      logger.error('matchingLeads', e);
    });
  } else {
    sendUploadEmail(null, stats);
  }
};

const parseCsv = (stream, res) => {
  if ($inProgress) {
    return res.send({message: 'In progress'});
  }

  res.send({ok: true});
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
        afterMath({
          start: startTime
        });
        $doneParsing = false;
      }
    })
    .catch(error => {
      $leadsTried++;

      if ($leadsTried === $parsedLeadsCount && $doneParsing) {
        afterMath({
          start: startTime
        });
        $doneParsing = false;
      }
    });
  })
  .on('end', ()=> {
    logger.log(`Parsed ${$parsedLeadsCount} leads`);
    $doneParsing = true;
  });
};

export default parseCsv;
