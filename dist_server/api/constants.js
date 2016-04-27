'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadFile = exports.csvHeaders = exports.validator = exports.makeRegexFromStates = exports.makeOptionRegex = exports.getMaps = exports.constants = exports.whiteListEmails = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../util/logger');

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _jsonCsv = require('json-csv');

var _jsonCsv2 = _interopRequireDefault(_jsonCsv);

var _states = require('./leads/states');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lodash2.default.mixin({
  compactObject: function compactObject(o) {
    var clone = _lodash2.default.clone(o);

    _lodash2.default.each(clone, function (v, k) {
      if (!v) {
        delete clone[k];
      }
    });
    return clone;
  }
});

var whiteListEmails = exports.whiteListEmails = ['willscottmoss@gmail.com', 'scott@unitedleadgroup.com'];

var constants = exports.constants = {
  propertyTypes: {
    'single family': 'singlefamily',
    singleFamily: 'singlefamily',
    singlefamily: 'singlefamily',
    condo: 'condo',
    multiplex: 'multiplex',
    townHouse: 'townhouse',
    'town house': 'townhouse',
    townhouse: 'townhouse'
  },

  creditRatings: {
    poor: 'poor',
    fair: 'fair',
    good: 'good',
    excellent: 'excellent'
  },

  loanPurposes: {
    refinanceFirst: 'refinancefirst',
    'refinance first': 'refinancefirst',
    refinancefirst: 'refinancefirst',
    refinanceCashOut: 'refinancecashout',
    'refinance cash out': 'refinancecashout',
    refinancecashout: 'refinancecashout',
    refinanceFirstFha: 'refinancefirstfha',
    'refinance first fha': 'refinancefirstfha',
    refinancefirstfha: 'refinancefirstfha',
    refinanceFirstVa: 'refinancefirstva',
    'refinance first va': 'refinancefirstva',
    refinancefirstva: 'refinancefirstva',
    debtConsolidation: 'debtconsolidation',
    'debt consolidation': 'debtconsolidation',
    debtconsolidation: 'debtconsolidation',
    heloc: 'heloc',
    buyFirstHome: 'buyfirsthome',
    'buy first home': 'buyfirsthome',
    buyfirsthome: 'buyfirsthome',
    buySecondHome: 'buysecondhome',
    'buy second home': 'buysecondhome',
    buysecondhome: 'buysecondhome'
  }
};

var getMaps = exports.getMaps = function getMaps() {
  var loanPurposes = constants.loanPurposes;
  var creditRatings = constants.creditRatings;
  var propertyTypes = constants.propertyTypes;
  return { loanPurposes: loanPurposes, creditRatings: creditRatings, propertyTypes: propertyTypes };
};

var makeOptionRegex = exports.makeOptionRegex = function makeOptionRegex(opts, type) {
  var props = _lodash2.default.uniq(_lodash2.default.reduce(opts, function (list, val, prop) {
    if (val) {
      list.push(constants[type][prop]);
    }

    return list;
  }, []));
  var pattern = _lodash2.default.reduce(props, function (_pattern, prop, i) {
    _pattern += '' + prop;

    if (props[i + 1]) {
      _pattern += '|';
    }

    return _pattern;
  }, '^(') + ')';

  var reg = new RegExp(pattern, 'gi');
  return reg;
};

var makeRegexFromStates = exports.makeRegexFromStates = function makeRegexFromStates(opts) {
  var states = _lodash2.default.compactObject(opts);
  var size = _lodash2.default.size(states);
  var str = _lodash2.default.reduce(states, function (_str, val, state) {
    size--;

    if (val) {
      _str += '' + state;
    }

    if (size) {
      _str += '|';
    }

    return _str;
  }, '^(') + ')';

  var reg = new RegExp(str, 'gi');
  return reg;
};

var validator = exports.validator = function validator(type) {
  var whiteList = constants[type] || {};

  var whiteListMap = _lodash2.default.reduce(whiteList, function (list, val) {
    list[val] = true;
    return list;
  }, {});

  return function (val) {
    return !!(val in whiteListMap);
  };
};

var csvHeaders = exports.csvHeaders = [{
  name: 'age',
  label: 'Age'
}, {
  name: 'firstName',
  label: 'First Name'
}, {
  name: 'lastName',
  label: 'Last Name'
}, {
  name: 'address.street',
  label: 'Address Street'
}, {
  name: 'address.city',
  label: 'Address State'
}, {
  name: 'address.state',
  label: 'Address State'
}, {
  name: 'address.zip',
  label: 'Address Zip'
}, {
  name: 'phone.home',
  label: 'Home Phone'
}, {
  name: 'phone.work',
  label: 'Work Phone'
}, {
  name: 'email',
  label: 'Email'
}, {
  name: 'bestTimeToContact',
  label: 'Best Time To Contact'
}, {
  name: 'homeOwner',
  label: 'Home Owner'
}, {
  name: 'creditRating',
  label: 'Credit Rating'
}, {
  name: 'LTV',
  label: 'LTV'
}, {
  name: 'CLTV',
  label: 'CLTV'
}, {
  name: 'requestedLoan.amountMin',
  label: 'Requested Amount Min'
}, {
  name: 'requestedLoan.amountMax',
  label: 'Requested Amount Max'
}, {
  name: 'requestedLoan.description',
  label: 'Requested Loan Dedscription'
}, {
  name: 'requestedLoan.purpose',
  label: 'Requested Loan Purpose'
}, {
  name: 'property.value',
  label: 'Property value'
}, {
  name: 'property.description',
  label: 'Property Description'
}, {
  name: 'property.locaton',
  label: 'Property Location'
}, {
  name: 'property.purchasePrice',
  label: 'Property Purchase Price'
}, {
  name: 'property.yearAcquired',
  label: 'Property Year Acquired'
}, {
  name: 'mortgage.totalBalance',
  label: 'Mortgage Total Balance'
}, {
  name: 'mortage.first.balance',
  label: 'First Mortgage Balance'
}, {
  name: 'mortgage.first.rate',
  label: 'First Mortgage Rate'
}, {
  name: 'mortgage.first.payment',
  label: 'First Mortgage Balance'
}, {
  name: 'mortage.second.balance',
  label: 'Second Mortgage Balance'
}, {
  name: 'mortgage.second.rate',
  label: 'Second Mortgage Rate'
}, {
  name: 'mortgage.second.payment',
  label: 'Second Mortgage Balance'
}];

var makeCsv = function makeCsv(res, data) {
  var options = {
    fields: csvHeaders
  };

  var source = _eventStream2.default.readArray(data.leads);
  var name = data.broker.name.replace(/\s/g, '');
  var date = new Date().toLocaleDateString().replace(/\//g, '-');
  var filename = name + '-' + date + '.csv';

  res.attachment(filename);
  source.pipe(_jsonCsv2.default.csv(options)).pipe(res);
};

var makePdf = function makePdf(res, data) {
  res.send({ message: 'PDFs not supoorted yet' });
};

var makeText = function makeText(res, data) {
  res.send({ message: 'Text files not supoorted yet' });
};

var downloadFile = exports.downloadFile = function downloadFile(res, filetype, data) {
  if (/csv/g.test(filetype)) {
    makeCsv(res, data);
  } else if (/text|txt/g.test(filetype)) {
    makeText(res, data);
  } else if (/pdf/g.test(filetype)) {
    makePdf(res, data);
  } else {
    res.send({ message: 'Email Scott' });
  }
};