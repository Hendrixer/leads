'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  logging: true,
  port: 8080,
  appUrl: process.env.APP_URL,
  sendErrors: true,
  uploadDest: process.env.UPLOAD_DEST || _path2.default.join(process.cwd(), 'uploads'),
  db: {
    seed: false,
    url: process.env.MONGO_URL
  }
};