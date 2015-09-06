import mongoose from 'mongoose';
const {Schema} = mongoose;

const BrokersSchema = new Schema({
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
    basic: {
      loanPurpose: {
        refinanceFirst: {
          type: Boolean,
          deafult: false
        },

        refinanceCashOut: {
          type: Boolean,
          deafult: false
        },

        refinanceFirstFha: {
          type: Boolean,
          deafult: false
        },

        refinanceFirstVa: {
          type: Boolean,
          deafult: false
        },

        debtConsolidation: {
          type: Boolean,
          deafult: false
        },

        heloc: {
          type: Boolean,
          deafult: false
        },

        buyFirstHome: {
          type: Boolean,
          deafult: false
        },

        buySecondHome: {
          type: Boolean,
          default: false
        }
      },

      creditRating: {
        excellent: {
          type: Boolean,
          deafult: false
        },

        good: {
          type: Boolean,
          deafult: false
        },

        fair: {
          type: Boolean,
          deafult: false
        },

        poor: {
          type: Boolean,
          deafult: false
        }
      },

      propertyType: {
        singleFamily: {
          type: Boolean,
          deafult: false
        },

        condo: {
          type: Boolean,
          deafult: false
        },

        townHouse: {
          type: Boolean,
          deafult: false
        },

        multiplex: {
          type: Boolean,
          deafult: false
        }
      }
    },

    detail: {

    }
  }
});

export const Brokers = mongoose.model('brokers', BrokersSchema);
