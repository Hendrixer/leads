'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Brokers = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = require('../constants');

var util = _interopRequireWildcard(_constants);

var _states = require('../leads/states');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var bluePrint = {
  name: {
    type: String,
    required: true,
    index: true
  },

  displayName: {
    type: String,
    unique: true
  },

  email: {
    sparse: true,
    trim: true,
    unique: true,
    type: String,
    index: true
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },

  website: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },

  fax: Number,

  address: {
    street: String,
    extra: String,
    city: String,
    state: String,
    zip: Number
  },

  timezone: String,

  leadFilters: {
    states: _lodash2.default.reduce(_states.states, function (schema, state) {
      schema[state.abbrev] = Boolean;
      return schema;
    }, {}),

    detail: {
      cltv: {
        use: Boolean,
        minimum: Number,
        maximum: Number
      },
      ltv: {
        use: Boolean,
        minimum: Number,
        maximum: Number
      },
      requestedLoanAmount: {
        use: Boolean,
        minimum: Number,
        maximum: Number
      },
      rate: {
        use: Boolean,
        minimum: Number,
        maximum: Number
      }
    },
    basic: {
      loanPurpose: {
        refinanceFirst: {
          type: Boolean,
          default: false
        },

        refinanceCashOut: {
          type: Boolean,
          default: false
        },

        refinanceFirstFha: {
          type: Boolean,
          default: false
        },

        refinanceFirstVa: {
          type: Boolean,
          default: false
        },

        debtConsolidation: {
          type: Boolean,
          default: false
        },

        heloc: {
          type: Boolean,
          default: false
        },

        buyFirstHome: {
          type: Boolean,
          default: false
        },

        buySecondHome: {
          type: Boolean,
          default: false
        }
      },

      creditRating: {
        excellent: {
          type: Boolean,
          default: false
        },

        good: {
          type: Boolean,
          default: false
        },

        fair: {
          type: Boolean,
          default: false
        },

        poor: {
          type: Boolean,
          default: false
        }
      },

      propertyType: {
        singleFamily: {
          type: Boolean,
          default: false
        },

        condo: {
          type: Boolean,
          default: false
        },

        townHouse: {
          type: Boolean,
          default: false
        },

        multiplex: {
          type: Boolean,
          default: false
        }
      }
    }
  }
};

var BrokersSchema = new Schema(bluePrint);
BrokersSchema.index({
  name: 'text'
});

var Brokers = exports.Brokers = _mongoose2.default.model('brokers', BrokersSchema);