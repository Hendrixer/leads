'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').load();

var mainconfig = {
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

mainconfig.env = process.env.NODE_ENV;

var config = exports.config = _extends({}, mainconfig, require('./' + mainconfig.env).default || {});