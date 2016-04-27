'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../util/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methodKeys = {
  limit: true,
  sort: true,
  populate: true,
  select: true
};

var query = exports.query = function query(action) {
  var qs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var criteria = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var filters = _lodash2.default.chain(qs).map(function (arg, filter) {
    if (methodKeys[filter]) {
      return { arg: arg, filter: filter };
    } else {
      return false;
    }
  }).compact().value();

  filters.forEach(function (_ref) {
    var filter = _ref.filter;

    delete qs[filter];
  });

  var searchCriteria = _lodash2.default.reduce(qs, function (_criteria, val, prop) {
    if (/StartsWith/.test(prop)) {
      prop = prop.split('Starts')[0];
      val = new RegExp('^' + val, 'i');
    }
    _criteria[prop] = val;
    return _criteria;
  }, criteria);

  var search = action(searchCriteria);

  filters.forEach(function (_ref2) {
    var arg = _ref2.arg;
    var filter = _ref2.filter;

    search = search[filter](arg);
  });

  return search.execAsync();
};