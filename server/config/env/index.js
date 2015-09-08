import _ from 'lodash';

let config = {
  envNames: {
    dev: 'development',
    prod: 'production',
    test: 'testing'
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || config.envNames.dev;
config.env = process.env.NODE_ENV;

const envConfig = require('./' + config.env);

config = _.merge({}, config, envConfig || {});
export default config;
