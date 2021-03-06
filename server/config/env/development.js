export default {
  logging: true,
  port: process.env.PORT || 3500,
  appUrl: `http://localhost:${process.env.port || 3500}`,
  sendErrors: false,
  db: {
    seed: false,
    url: 'mongodb://localhost/leads'
  }
};
