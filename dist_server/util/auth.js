'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signInAdmin = exports.createAdmin = exports.signToken = exports.isAuth = exports.validateJwt = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _composableMiddleware = require('composable-middleware');

var _composableMiddleware2 = _interopRequireDefault(_composableMiddleware);

var _env = require('../config/env');

var _admins = require('../api/admins/admins.model');

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateJwt = exports.validateJwt = (0, _expressJwt2.default)({
  secret: _env.config.secrets.jwt
});

var isAuth = exports.isAuth = function isAuth() {
  return (0, _composableMiddleware2.default)().use(function (req, res, next) {
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    validateJwt(req, res, next);
  }).use(function (req, res, next) {
    _admins.Admins.findByIdAsync(req.user._id).then(function (admin) {
      if (!admin) {
        return res.status(401).end();
      }

      req.admin = admin;
      next();
    }).catch(function (e) {
      next(e);
    });
  });
};

var signToken = exports.signToken = function signToken(id, role) {
  return _jsonwebtoken2.default.sign({ _id: id }, _env.config.secrets.jwt, {
    expiresInMinutes: 24 * 60 * 15
  });
};

var createAdmin = exports.createAdmin = function createAdmin() {
  return (0, _composableMiddleware2.default)().use(function (req, res, next) {
    if (req.body.secret !== _env.config.secrets.adminSecret) {
      console.log(req.body, _env.config.secrets.adminSecret);
      return res.status(401).end();
    }

    _admins.Admins.findOneAsync({ email: req.body.email }).then(function (admin) {
      if (admin) {
        return res.status(401).end();
      }

      next();
    });
  }).use(function (req, res, next) {
    var password = _bcryptjs2.default.hashSync(req.body.password, 8);

    _admins.Admins.createAsync({
      password: password,
      email: req.body.email
    }).then(function (admin) {
      req.admin = admin;
      next();
    }).catch(function (e) {
      next(e);
    });
  });
};

var signInAdmin = exports.signInAdmin = function signInAdmin() {
  return (0, _composableMiddleware2.default)().use(function (req, res, next) {
    _admins.Admins.findOneAsync({ email: req.body.email }).then(function (admin) {
      if (!admin) {
        return res.status(401).end();
      }

      var isPass = _bcryptjs2.default.compareSync(req.body.password, admin.password);

      if (!isPass) {
        return res.status(401).end();
      }

      req.admin = admin;
      next();
    }).catch(function (e) {
      next(e);
    });
  });
};