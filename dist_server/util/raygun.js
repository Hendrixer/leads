'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raygun = require('raygun');

var _raygun2 = _interopRequireDefault(_raygun);

var _env = require('../config/env');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var raygun = new _raygun2.default.Client().init({ apiKey: _env.config.secrets.raygunKey });
exports.default = raygun;