import { scrubPhone } from '../parseCsv';

const processPhones = (job, done) => {
  const {filename, email} = job.attrs.data;

  scrubPhone(filename, email)
  .then(done)
  .catch(done);
};

export default function(agenda) {
  agenda.define('scrub phone', processPhones);
};
