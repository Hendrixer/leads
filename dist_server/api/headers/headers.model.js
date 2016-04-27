'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Headers = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var defaults = ['ContactFirstName', 'ContactLastName', 'ContactAddress1', 'ContactCity', 'ContactStateOrProvince', 'ContactPostalCode', 'ContactHomePhone', 'ContactWorkPhone', 'ContactEmail', 'BestContactTimeDescription', 'HomeOwnerYesNo', 'CreditRatingDescription', 'LTV', 'CLTV', 'RequestedLoanAmountMin', 'RequestedLoanAmountMax', 'RequestedLoanTypeDescription', 'RequestedLoanPurposeAbbrv', 'PropertyValue', 'PropertyTypeDescription', 'PropertyLocation', 'PropertyPurchasePrice', 'PropertyYearAcquired', 'MortgagesTotalBalance', 'Mortgage1Balance', 'Mortgage1Rate', 'Mortgage1Payment', 'Mortgage2Balance', 'Mortgage2Rate', 'Mortgage2Payment'];

var HeadersSchema = new Schema({
  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers',
    requried: true
  },

  hasDefaultHeaders: {
    type: Boolean,
    default: false
  },

  fileHeaders: defaults.reduce(function (map, header) {
    map[header] = String;
    return map;
  }, {})
});

var Headers = exports.Headers = _mongoose2.default.model('headers', HeadersSchema);