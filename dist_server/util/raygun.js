'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raygun = require('raygun');

var _raygun2 = _interopRequireDefault(_raygun);

var _env = require('../config/env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var raygun = new _raygun2.default.Client().init({ apiKey: _env2.default.secrets.raygunKey });
exports.default = raygun;