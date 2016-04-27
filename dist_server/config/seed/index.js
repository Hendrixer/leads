'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _leads = require('../../api/leads/leads.model');

var _brokers = require('../../api/brokers/brokers.model');

var _orders = require('../../api/orders/orders.model');

var _resolves = require('../../api/resolves/resolves.model');

var _brokers2 = require('./brokers.json');

var _brokers3 = _interopRequireDefault(_brokers2);

var _logger = require('../../util/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import leadData from './leads.json';


var mockPairs = [{ model: _brokers.Brokers, data: _brokers3.default }];

var clean = function clean() {
  for (var _len = arguments.length, models = Array(_len), _key = 0; _key < _len; _key++) {
    models[_key] = arguments[_key];
  }

  _logger.logger.log('...cleaning db');
  return _bluebird2.default.all(models.map(function (model) {
    return model.remove();
  }));
};

var createDocuments = function createDocuments(pairs) {
  return _bluebird2.default.all(pairs.map(function (pair) {
    var data = pair.data;

    if (pair.format) {
      data = data.map(function (doc) {
        if (!doc.type) {
          doc.type = 'mortage';
        }

        return pair.format(doc);
      });
    }

    return pair.model.createAsync(data);
  }));
};

clean(_brokers.Brokers, _orders.Orders, _resolves.Resolves).then(function () {
  _logger.logger.log('so clean');
}).then(function (removed) {
  return createDocuments(mockPairs);
}).then(function (created) {
  _logger.logger.log('seeded ' + created[0].length + ' documents');
});