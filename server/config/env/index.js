import _ from 'lodash';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

let config = {
  envNames: {
    dev: 'development',
    prod: 'production',
    test: 'testing'
  },

  secrets: {
    pusher: {
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET
    },
    adminSecret: process.env.ADMIN_SECRET,
    jwt: process.env.JWT,
    raygunKey: process.env.RAYGUN_APIKEY,
    emailTo: process.env.EMAIL_TO,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_PASS
  }
};

config.env = process.env.NODE_ENV;

const envConfig = require('./' + config.env);

config = _.merge({}, config, envConfig || {});
export default config;
