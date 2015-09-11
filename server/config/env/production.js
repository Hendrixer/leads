export default {
  logging: false,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  db: {
    seed: false,
    url: process.env.MONGOLAB_URI
  }
};
