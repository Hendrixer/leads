import {Leads} from '../api/leads/leads.model';
import {logger} from './logger';
import csvParser from 'csv-parser';
import CombineStream from 'combined-stream';
import sendMail from './email';
import config from '../config/env';
import {Resolves} from '../api/resolves/resolves.model';
import _ from 'lodash';

let leadsCount = 0;

let $leads = [];
let $dupes = [];
let leadsSaved = 0
const limit = 10000;

const sendUploadEmail = (resolveId, stats) => {
  logger.log('bout to send', stats, resolveId);
  const opts = {
    uploaded: leadsCount,
    duration: (Date.now() - stats.start)/1000 + ' seconds',
    saved: leadsSaved,
    dupes: $dupes.length
  };

  if (resolveId) {
    opts.dupeLink = `${config.appUrl}/#/resolve/${resolveId}`;
  }
  return sendMail('upload', opts)
  .then(i => {
    $leads = [];
    $dupes = [];
    leadsCount = 0;
    leadsSaved = 0;
    logger.log('email sent', i)
  })
  .catch(e => {
    logger.error('mail error', e);
    $leads = [];
    $dupes = [];
    leadsCount = 0;
    leadsSaved = 0;
  })
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
  logger.log('$dupes', $dupes.length)
  logger.log('$leads', $leads.length);
  logger.log('leads count', leadsCount);
  logger.log('leads saved', leadsSaved);

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
      })
    }))
    .then(matchingLeads => {
      const dupePairs = _.map(matchingLeads, (lead, i) => {
        return {dupe: $dupes[i], alike: lead}
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
      })
    })
    .then(id => {
      return sendUploadEmail(id, stats);
    })
    .catch(e => {
      logger.error('matchingLeads', e);
    })
  } else {
    sendUploadEmail(null, stats);
  }
};

const parseCsv = (stream) => {
  const startDate = Date.now();

  stream.pipe(csvParser())
  .on('data', row => {
    leadsCount++;
    const prom = Leads.saveDupe(row)
    .then(data => {
      if (data.type === 'dupe') {
        $dupes.push(data.lead);
      } else {
        leadsSaved++;
       return data;
      }
    });

    if (leadsSaved > limit) {
      const lastProm = $leads.pop();
      $leads = [lastProm];
    }
    $leads.push(prom);
  })
  .on('end', ()=> {
    logger.log(`Parsed ${leadsCount} leads`, $leads.length);
      Promise.all($leads)
      .then(() => {
        afterMath({
          start: startDate
        });
      })
      .catch(e => {
        logger.error('noops', e);
      })
  });
};

export default parseCsv;
