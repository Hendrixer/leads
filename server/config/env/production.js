export default {
  logging: false,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  sendErrors: true,
  db: {
    seed: false,
    url: process.env.MONGOHQ_URL
  }
};
