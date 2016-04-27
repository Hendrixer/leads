'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.api = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _admins = require('./admins/admins.routes');

var _admins2 = _interopRequireDefault(_admins);

var _brokers = require('./brokers/brokers.routes');

var _brokers2 = _interopRequireDefault(_brokers);

var _leads = require('./leads/leads.routes');

var _leads2 = _interopRequireDefault(_leads);

var _orders = require('./orders/orders.routes');

var _orders2 = _interopRequireDefault(_orders);

var _resolves = require('./resolves/resolves.routes');

var _resolves2 = _interopRequireDefault(_resolves);

var _headers = require('./headers/headers.routes');

var _headers2 = _interopRequireDefault(_headers);

var _notes = require('./notes/notes.routes');

var _notes2 = _interopRequireDefault(_notes);

var _auth = require('../util/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = _express2.default.Router();

api.use('/admins', _admins2.default);
api.use('/brokers', (0, _auth.isAuth)(), _brokers2.default);
api.use('/leads', (0, _auth.isAuth)(), _leads2.default);
api.use('/orders', (0, _auth.isAuth)(), _orders2.default);
api.use('/resolves', (0, _auth.isAuth)(), _resolves2.default);
api.use('/headers', (0, _auth.isAuth)(), _headers2.default);
api.use('/notes', (0, _auth.isAuth)(), _notes2.default);

exports.api = api;