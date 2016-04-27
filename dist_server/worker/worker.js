'use strict';

var _background = require('./background');

var _background2 = _interopRequireDefault(_background);

var _message = require('../util/message');

var _logger = require('../util/logger');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var background = new _background2.default();

var app = (0, _express2.default)();

app.get('/status', function (req, res) {
  return res.send({ ok: true });
});

app.get('/new-lead', function (req, res) {
  background.addJob(req.query.type);
  res.send(200);
});

app.listen(8081, function () {
  console.log('worker on port 8081');
});