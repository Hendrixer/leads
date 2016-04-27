'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _logger = require('../logger');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport({
  service: 'Gmail',
  auth: {
    user: _env2.default.secrets.gmailUser,
    pass: _env2.default.secrets.gmailPass
  }
});
var phoneTemplate = _fs2.default.readFileSync('./server/util/email/phones.html');
var leadTemplate = _fs2.default.readFileSync('./server/util/email/report.html');

var makeDupeEmail = function makeDupeEmail(stats, toEmail) {
  stats.mailto = stats.mailto || _env2.default.secrets.adminEmail;
  var template = _lodash2.default.template(leadTemplate)(stats);
  var options = {
    from: 'LeadOn',
    to: toEmail || _env2.default.secrets.emailTo,
    subject: 'LeadOn upload report 😎',
    html: template
  };

  return options;
};

var makePhoneEmail = function makePhoneEmail(stats, toEmail) {
  stats.mailto = stats.mailto || _env2.default.secrets.adminEmail;
  var template = _lodash2.default.template(phoneTemplate)(stats);
  var options = {
    from: 'LeadOn',
    to: toEmail || _env2.default.secrets.emailTo,
    subject: 'LeadOn phone supression report 😎',
    html: template
  };

  return options;
};

var sendMail = function sendMail(type, stats, toEmail) {
  return new _bluebird2.default(function (yes, no) {
    var ops = void 0;
    if (type === 'upload') {
      ops = makeDupeEmail(stats, toEmail);
    }

    if (type === 'phone') {
      ops = makePhoneEmail(stats, toEmail);
    }

    transporter.sendMail(ops, function (err, info) {
      err ? no(err) : yes(info);
    });
  });
};

exports.default = sendMail;