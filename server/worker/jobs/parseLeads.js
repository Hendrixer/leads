import { handleJob } from '../parseCsv';

const processLeads = (job, done) => {
  console.log(job.attrs.data.filename);
  handleJob(job.attrs.data.filename)
  .then(done);
};

export default function(agenda) {
  agenda.define('parse leads', processLeads);
}
