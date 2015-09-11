export default {
  logging: true,
  port: process.env.PORT || 3500,
  appUrl: `http://localhost:${process.env.port || 3500}`,
  db: {
    seed: true,
    url: 'mongodb://localhost/leads'
  }
};
