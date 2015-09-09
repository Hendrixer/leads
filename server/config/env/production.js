export default {
  logging: false,
  port: process.env.PORT,
  db: {
    seed: false,
    url: process.env.MONGOLAB_URI
  }
};
