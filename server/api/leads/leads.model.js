import {logger} from '../../util/logger';
import mongoose from 'mongoose';
import * as utils from '../constants';
import _ from 'lodash';
import {stateMap as states} from './states';

const {Schema} = mongoose;

const LeadsSchema = new Schema({
  age: Number,

  createdAt: {
    type: Date
  },

  type: {
    type: String
  },

  firstName: {
    type: String,
    required: true,
    index: true
  },
  lastName: {
    type: String
  },

  dupeKey: {
    type: String,
    required: true,
    index: true,
    unique: true
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },

  phone: {
    home: {
      unique: true,
      type: Number,
      sparse: true
    },
    work: {
      unique: true,
      type: Number,
      sparse: true
    },
  },

  email: {
    type: String,
    index: true,
    sparse: true,
    unique: true
  },

  bestTimeToContact: String,

  homeOwner: {
    type: Boolean,
    default: false,
  },

  creditRating: {
    type: String,
    validate: utils.validator('creditRatings')
  },

  LTV: Number,
  CLTV: Number,

  requestedLoan: {
    amountMin: Number,
    amountMax: Number,
    description: String,
    purpose: {
      type: String,
      validate: utils.validator('loanPurposes')
    },
  },

  property: {
    value: Number,
    description: {
      type: String,
      validate: utils.validator('propertyTypes')
    },
    location: String,
    purchasePrice: Number,
    yearAcquired: Number,
  },

  mortgage: {
    totalBalance: Number,
    first: {
      balance: Number,
      rate: Number,
      payment: Number,
    },
    second: {
      balance: Number,
      rate: Number,
      payment: Number,
    }
  }
});

LeadsSchema.index({
  email: 'text',
  firstName: 'text',
  lastName: 'text'
});

const checkForNull = (prop) => {
  if (/^null$/ig.test(prop)) {
    return undefined;
  } else {
    return prop;
  }
};

const getState = (prop) => {
  if (checkForNull(prop)) {
    if (prop.length > 2) {
      prop = prop.toLowerCase();
      prop = prop.replace(/\s/g, '');
    } else {
      prop = prop.toUpperCase();
    }

    return states[prop];
  }
};

const normal = (prop) => {
  if (checkForNull(prop)) {
    return prop.toLowerCase();
  }
};

const replaceNum = (prop)=> {
  if (checkForNull(prop)) {
    prop = '' + prop;
    prop = prop.replace('1st', 'first');
    prop = prop.replace('2nd', 'second');
    prop = prop.replace(/refi\s/i, 'refinance ');
    prop = prop.replace('2-4 ', 'multi');
    prop = prop.replace(/residence/i, '');
    prop = prop.replace(/-|\s/g, '');
    return prop.toLowerCase().trim();
  }
};

const parseNum = (prop) => {
  if (checkForNull(prop)) {

    if (_.isNumber(prop)) {
      return prop;
    }

    prop = prop.replace(/,/g, '');
    prop = parseFloat(prop);

    if (_.isNaN(prop)) {
      return undefined;
    }

    return prop;
  }
};

const getDupeKey = (lead) => {
  if (lead.email) {
    lead.email = lead.email.toLowerCase();
  }

  if (lead.lastName) {
    lead.lastName = lead.lastName.toLowerCase();
  }

  if (lead.firstName) {
    lead.firstName = lead.firstName.toLowerCase();
  }

  return `${lead.firstName}${lead.lastName}${lead.email}`;
};

LeadsSchema.statics.format = (lead) => {
  let type = 'mortgage';

  const newLead = {
    age: parseNum(lead.Age),
    type: lead.type || type,
    firstName: checkForNull(lead.ContactFirstName),
    lastName: checkForNull(lead.ContactLastName),
    email: checkForNull(lead.ContactEmail),
    address: {
      street: checkForNull(lead.ContactAddress1),
      city: checkForNull(lead.ContactCity),
      state: getState(lead.ContactStateOrProvince),
      zip: parseNum(lead.ContactPostalCode) //replaceNum()
    },
    phone: {
      home: replaceNum(lead.ContactHomePhone),
      work: replaceNum(lead.ContactWorkPhone)
    },
    bestTimeToContact: checkForNull(lead.BestContactTimeDescription),
    homeOwner: lead.HomeOwnerYesNo && lead.HomeOwnerYesNo === 'Yes' ? true : false,
    creditRating: normal(lead.CreditRatingDescription),
    LTV: checkForNull(lead.LTV),
    CLTV: checkForNull(lead.CLTV),
    requestedLoan: {
      amountMin: checkForNull(lead.RequestedLoanAmountMin),
      amountMax: checkForNull(lead.RequestedLoanAmountMax),
      description: normal(lead.RequestedLoanTypeDescription),
      purpose: replaceNum(lead.RequestedLoanPurposeAbbrv)
    },

    property: {
      value: parseNum(lead.PropertyValue),
      description: replaceNum(lead.PropertyTypeDescription),
      location: normal(lead.PropertyLocation),
      purchasePrice: parseNum(lead.PropertyPurchasePrice),
      yearAcquired: parseNum(lead.PropertyYearAcquired)
    },

    mortgage: {
      totalBalance: parseNum(lead.MortgagesTotalBalance),
      first: {
        balance: parseNum(lead.Mortgage1Balance),
        rate: parseNum(lead.Mortgage1Rate),
        payment: parseNum(lead.Mortgage1Payment)
      },
      second: {
        balance: parseNum(lead.Mortgage2Balance),
        rate: parseNum(lead.Mortgage2Rate),
        payment: parseNum(lead.Mortgage2Payment)
      }
    }
  };

  newLead.dupeKey = getDupeKey(newLead);
  return newLead;
};

const dupeErr = (err) => {
  return !!(
    (err.code && (err.code === 11000 || err.code === '11000')) ||
    (err.errmsg && /E11000/gi.test(err.errmsg))
  );
};

LeadsSchema.statics.saveDupe = (lead)=> {
  const Leads = mongoose.model('leads');
  lead = Leads.format(lead);

  return new Promise((resolve, reject) => {
    new Leads(lead).save((err, savedLead) => {
      if (err) {
        if (dupeErr(err)) {
          const dupe = {
            type: 'dupe',
            lead: lead
          };
          resolve(dupe);
        } else {
          reject(err);
        }
      } else {
        if (!savedLead) {
          logger.log('blank');
        } else {
          resolve(savedLead);
        }
      }
    });
  });
};

LeadsSchema.statics.isThere = (number) => {
  const Leads = mongoose.model('leads');
  return Leads.findOneAsync({
    $or: [{'phone.home': number}, {'phone.work': number}]
  })
  .then(lead => {
    return Boolean(lead);
  });
};

LeadsSchema.methods.saveDupe = () => {
  const Leads = mongoose.model('leads');
  return Leads.saveDupe([this]);
};

LeadsSchema.pre('save', function(next) {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }

  next();
});

export const Leads = mongoose.model('leads', LeadsSchema);
