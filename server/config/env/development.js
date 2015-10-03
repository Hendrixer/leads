export default {
  logging: true,
  port: process.env.PORT || 3500,
  jobInterval: 5000,
  appUrl: `http://localhost:${process.env.port || 3500}`,
  sendErrors: false,
  db: {
    seed: true,
    url: 'mongodb://localhost/leads'
  }
};
