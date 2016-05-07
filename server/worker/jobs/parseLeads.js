import { handleJob } from '../parseCsv';

const processLeads = (job, done) => {
  const {filename, email} = job.attrs.data;

  handleJob(filename, email)
  .then(done)
  .catch(done);
};

export default function(agenda) {
  agenda.define('parse leads', processLeads);
}
