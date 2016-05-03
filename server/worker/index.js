import { config } from '../config/env';
import Agenda from 'agenda';
import Future from 'bluebird';
import mongoose from 'mongoose';
import Firebase from 'firebase';

const jobStream = new Firebase(config.fireRef);

Future.promisifyAll(mongoose.Model);
Future.promisifyAll(mongoose.Model.prototype);
Future.promisifyAll(mongoose.Query.prototype);
mongoose.connect(config.db.url);

const agenda = new Agenda({db: {address: config.db.url, collection: 'jobs'}});

require('./jobs').default(agenda);

agenda.on('ready', agenda.start.bind(agenda));

jobStream.limitToLast(1).on('child_added', snap => {
  const {filename, jobname} = snap.val();
  agenda.now(jobname, {filename});
  jobStream.child(snap.key()).remove();
});

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

export {agenda};
