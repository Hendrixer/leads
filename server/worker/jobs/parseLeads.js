import { handleJob } from '../parseCsv';

const parseLeads = (job, done) => {
  handleJob(job.attrs.data.filename)
  .then(done);
};

export default function(agenda) {
  agenda.define('parse leads', job => console.log(job));
}
