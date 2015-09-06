import {logger} from '../../util/logger';
import mongoose from 'mongoose';
const {Schema} = mongoose;

const LeadsSchema = new Schema({
  age: Number,

  type: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },

  phone: {
    home: String,
    work: String,
  },

  email: {
    type: String,
    index: true,
    sparse: true,
    trim: true
  },

  bestTimeToContact: String,

  homeOwner: {
    type: String,
    default: false,
  },

  creditRating: String,

  LTV: Number,
  CLTV: Number,

  requestedLoan: {
    amountMin: String,
    amountMax: String,
    description: String,
    purpose: String,
  },

  property: {
    value: String,
    description: String,
    location: String,
    purchasePrice: String,
    yearAcquired: String,
  },

  mortgage: {
    totalBalance: String,
    first: {
      balance: String,
      rate: String,
      payment: String,
    },
    second: {
      balance: String,
      rate: String,
      payment: String,
    },
  },
});

LeadsSchema.statics.format = (lead) => {
  let type = 'education';

  if (lead.Mortgage1Balance || lead.Mortgage2Balance || lead.Mortgage2Payment) {
    type = 'mortgage';
  }

  const newLead = {
    age: lead.Age,
    type: lead.type || type,
    firstName: lead.ContactFirstName,
    lastName: lead.ContactLastName,
    address: {
      street: lead.ContactAddress1,
      city: lead.ContactCity,
      state: lead.ContactStateOrProvince,
      zip: lead.ContactPostalCode
    },
    phone: {
      home: lead.ContactHomePhone,
      work: lead.ContactWorkPhone
    },
    bestTimeToContact: lead.BestContactTimeDescription,
    homeOwner: lead.HomeOwnerYesNo,
    creditRating: lead.CreditRatingDescription,
    LTV: lead.LTV,
    CLTV: lead.CLTV,
    requestedLoan: {
      amountMin: lead.RequestedLoanAmountMin,
      amountMax: lead.RequestedLoanAmountMax,
      description: lead.RequestedLoanTypeDescription,
      purpose: lead.RequestedLoanPurposeAbbrv
    },

    property: {
      value: lead.PropertyValue,
      description: lead.PropertyTypeDescription,
      location: lead.PropertyLocation,
      purchasePrice: lead.PropertyPurchasePrice,
      yearAcquired: lead.PropertyYearAcquired
    },

    mortgage: {
      totalBalance: lead.MortgagesTotalBalance,
      first: {
        balance: lead.Mortgage1Balance,
        rate: lead.Mortgage1Rate,
        payment: lead.Mortgage1Payment
      },
      second: {
        balance: lead.Mortgage2Balance,
        rate: lead.Mortgage2Rate,
        payment: lead.Mortgage2Payment
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
        if (err && err.code === 1100) {
          logger.error('dupe', lead.email);
          // return Leads.findOne({ email: lead.email });
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
