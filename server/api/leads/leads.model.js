import {logger} from '../../util/logger';
import mongoose from 'mongoose';
import * as utils from '../constants';

const {Schema} = mongoose;

const LeadsSchema = new Schema({
  age: Number,

  type: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
    index: true
  },
  lastName: {
    type: String,
    required: true,
    index: true
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },

  phone: {
    home: Number,
    work: Number,
  },

  email: {
    type: String,
    index: true,
    sparse: true,
    trim: true,
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
    amountMin: String,
    amountMax: String,
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
    },
  },
});

const checkForNull = (prop) => {
  if (prop === 'NULL') {
    return;
  } else {
    return prop;
  }
}

const normal = (prop) => {
  if(checkForNull(prop)) {
    return prop.toLowerCase();
  }
}

const replaceNum = (prop) => {
  if (checkForNull(prop)) {
    prop = prop.replace('1st', 'first');
    prop = prop.replace('2nd', 'second');
    prop = prop.replace(/refi\s/i, 'refinance ');
    prop = prop.replace('2-4 ', 'multi');
    prop = prop.replace(/residence/i, '');
    return prop.toLowerCase().trim();
  }
};

const parseNum = (prop) => {
  if (checkForNull(prop)) {
    let num;

    try {
      num = parseInt(prop);
    } catch(e) {
    }
    return undefined;
  }
};

LeadsSchema.statics.format = (lead) => {
  let type = 'education';

  if (lead.Mortgage1Balance || lead.Mortgage2Balance || lead.Mortgage2Payment) {
    type = 'mortgage';
  }

  const newLead = {
    age: parseNum(lead.Age),
    type: lead.type || type,
    firstName: checkForNull(lead.ContactFirstName),
    lastName: checkForNull(lead.ContactLastName),
    address: {
      street: checkForNull(lead.ContactAddress1),
      city: checkForNull(lead.ContactCity),
      state: checkForNull(lead.ContactStateOrProvince),
      zip: parseNum(lead.ContactPostalCode)
    },
    phone: {
      home: checkForNull(lead.ContactHomePhone),
      work: checkForNull(lead.ContactWorkPhone)
    },
    bestTimeToContact: checkForNull(lead.BestContactTimeDescription),
    homeOwner: lead.HomeOwnerYesNo&&lead.HomeOwnerYesNo === 'Yes'? true: false,
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

  if (lead.ContactEamil) {
    newLead.email = lead.ContactEamil;
  }

  return newLead;
};

LeadsSchema.statics.saveDupe = (leads)=> {
  if (!Array.isArray(leads)) {
    leads = [leads];
  }

  const Leads = mongoose.model('leads');

  return Promise.all(leads.map(lead => {
    lead = Leads.format(lead);

    return new Promise((resolve, reject) => {
      new Leads(lead).save((err, lead) => {
        if (err) logger.error(lead, err);
        if (err.code === 1100) {
          logger.error('dupe', lead.email);

        } else {
          return lead;
        }
      })
    })
  }));
};

LeadsSchema.methods.saveDupe = () => {
  const Leads = mongoose.model('leads');

  return Leads.saveDupe([this]);
};

export const Leads = mongoose.model('leads', LeadsSchema);
