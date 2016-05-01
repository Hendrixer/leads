import path from 'path';

export default {
  logging: true,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  db: {
    seed: false,
    url: process.env.MONGO_URL
  }
};
