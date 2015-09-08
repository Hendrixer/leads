export default {
  logging: false,
  port: process.env.PORT || 3500,
  db: {
    seed: false,
    url: process.env.MONGOLAB_URI
  }
};
