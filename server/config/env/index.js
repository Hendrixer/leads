import _ from 'lodash';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


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
    jwt: process.env.JWT || 'cookiemonster',
    raygunKey: process.env.RAYGUN_APIKEY
  }
};

config.env = process.env.NODE_ENV;

const envConfig = require('./' + config.env);

config = _.merge({}, config, envConfig || {});
export default config;
