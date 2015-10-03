import {Leads} from '../api/leads/leads.model';
import {logger} from '../util/logger';
import {Resolves, ResolvesSession} from '../api/resolves/resolves.model';
import csvParser from 'csv-parser';
import CombineStream from 'combined-stream';
import sendMail from '../util/email';
import config from '../config/env';
import _ from 'lodash';
import Future from 'bluebird';
import fs from 'fs';
import path from 'path';
import es from 'event-stream';
import uuidMaker from 'node-uuid';

export const createStreamFromFiles = (files) => {
  const mergedStream = CombineStream.create();

  return files.reduce((stream, file) => {
    stream.append(fs.createReadStream(
      path.join(__dirname, '../../', file.path)
    ));
    return stream;
  }, mergedStream);
};

export const parseCsvStream = (files) => {
  return new Promise((resolve, reject) => {
    const csvStream = createStreamFromFiles(files);
    const startTime = Date.now();
    const meta = {
      dupes: 0,
      saved: 0,
      tried: 0,
      startTime
    };
    const uuid = uuidMaker.v1();

    csvStream
    .pipe(csvParser())
    .pipe(es.mapSync(data => Leads.format(data)))
    .pipe(es.map((data, done) => {
      meta.tried++;
      Leads.createAsync(data)
      .then(lead => {
        meta.saved++;
        done(null, lead);
      })
      .catch(err => {
        if (dupeErr(err)) {
          meta.dupes++;
          saveDupe(data, uuid)
          .then(()=> {
            done();
          });
        } else {
          done(err);
        }
      });
    }))
    .on('end', ()=> {
      meta.duration = (Date.now() - meta.startTime) / 1000 + ' seconds';
      meta.uuid = uuid;
      resolve(meta);
    });
  });
};

const dupeErr = (err) => {
  return !!(
    (err.code && (err.code === 11000 || err.code === '11000')) ||
    (err.errmsg && /E11000/gi.test(err.errmsg))
  );
};

export const handleJob = (job) => {
  return parseCsvStream(job.data.files)
  .then(meta => {
    if (!meta.dupes) {
      return meta;
    }

    return ResolvesSession.createAsync({})
    .then(Session => {
      return Resolves.findAsync({uuid: meta.uuid})
      .then(resolves => {
        return saveResolveSession(Session, resolves);
      });
    })
    .then(session => {
      meta.sessionId = session._id;
      return meta;
    });
  })
  .then(meta => {
    return sendMail('upload', meta);
  });
};

export const saveResolveSession = (Session, resolves) => {
  return new Promise((resolve, reject) => {
    Session.resolves = _.map(resolves, resolve => {
      return resolve._id;
    });
    Session.save((err, saved) => {
      err ? reject(err) : resolve(saved);
    });
  });
};

export const saveDupe = (dupe, uuid) => {
  if (dupe.email) {
    dupe.email = dupe.email.toLowerCase();
  }

  if (dupe.lastName) {
    dupe.lastName = dupe.lastName.toLowerCase();
  }

  dupe.firstName = dupe.firstName.toLowerCase();
  const dupeKey = `${dupe.firstName}${dupe.lastName}${dupe.email}`;

  return Leads.findOneAsync({
    $or: [{email: dupe.email}, {dupeKey}]
  })
  .then(lead => {
    return Resolves.createAsync({
      dupe,
      uuid,
      lead: lead._id,
    });
  });
};
