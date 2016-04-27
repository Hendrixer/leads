'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').load();

var config = {
  envNames: {
    dev: 'development',
    prod: 'production',
    test: 'testing'
  },

  secrets: {
    adminSecret: process.env.ADMIN_SECRET,
    jwt: process.env.JWT,
    emailTo: process.env.EMAIL_TO,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_PASS,
    adminEmail: process.env.ADMIN_EMAIL,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET
  }
};

config.env = process.env.NODE_ENV;

var envConfig = require('./' + config.env);

config = _lodash2.default.merge({}, config, envConfig || {});
exports.default = config;