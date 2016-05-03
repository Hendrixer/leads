import {
  handleJob,
  scrubPhone
} from '../parseCsv';

const processLeads = (job, done) => {
  handleJob(job.attrs.data.filename)
  .then(done)
  .catch(done);
};

const processPhones = (job, done) => {
  scrubPhone(job.attrs.data.filename)
  .then(done)
  .catch(done);
};

export default function(agenda) {
  agenda.define('parse leads', processLeads);
  agenda.define('scrub phone', processPhones)
}
