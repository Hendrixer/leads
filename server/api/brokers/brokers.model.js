import _ from 'lodash';
import mongoose from 'mongoose';
import * as util from '../constants';
import {states} from '../leads/states';

const {Schema} = mongoose;
const bluePrint = {
  name: {
    type: String,
    required: true
  },

  displayName: {
    type: String,
    required: true,
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
    sparse: true,
    index: true
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
    states: _.reduce(states, (schema, state) => {
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

const BrokersSchema = new Schema(bluePrint);

export const Brokers = mongoose.model('brokers', BrokersSchema);
