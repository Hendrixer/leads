'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLogConfig = function getLogConfig(env) {
  if (env !== 'production') return {};
  return {
    skip: function skip(req, res) {
      return res.statusCode < 400;
    }
  };
};

var setup = function setup(app) {
  app.use((0, _compression2.default)());
  app.use('/bundle.js', function (req, res, next) {
    res.set('X-SourceMap', 'bundle.js.map');
    next();
  });
  app.use(_express2.default.static(__dirname + '/../../dist'));
  app.use((0, _morgan2.default)('dev', getLogConfig(process.env.NODE_ENV)));
  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json({ limit: 7000000 }));
};

exports.default = setup;