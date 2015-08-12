import mongoose from 'mongoose';
const {Schema} = mongoose;

const LeadsSchema = new Schema({
  age: Number,

  type: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    sparse: true
  },

  address: {
    street: String,
    extra: String,
    city: String,
    state: String,
    zipcode: Number
  },

  phone: {
    home: {
      type: Number
    },
    work: {
      type: Number
    }
  },

  bestContact: String,
  homeOwner: {
    required: true,
    type: Boolean
  },

  creditRating: String,

  ltv: Number,
  cltv: Number,

  loan: {
    requested: Number,
    max: Number,
    description: String,
    purpose: String
  },

  property: {
    value: Number,
    description: String,
    location: String,
    price: Number,
    year: Number
  },

  mortgage: {
    totalBalance: Number,

    firstBalance: Number,
    firstRate: Number,
    firstType: String,
    firstPaymentAmount: Number,

    secondBalance: Number,
    secondRate: Number,
    secondType: String,
    secondPaymentAmount: Number
  }
});

LeadsSchema.statics.format = (lead) => {
  const newLead = {
    age: lead.Age,
    type: 'mortgage',
    name: lead.ContactFullName,
    email: lead.email,
    address: {
      street: lead.ContactAddress1,
      extra: lead.ContactAddress2,
      city: lead.ContactCity,
      state: lead.ContactStateOrProvince,
      zipcode: lead.ContactPostalCode
    },

    phone: {
      home: lead.ContactHomePhone,
      work: lead.ContactWorkPhone
    },
    bestContact: lead.BestContactTimeDescription,
    homeOwner: lead.HomeOwnerYesNo,
    creditRating: lead.CreditRatingDescription,
    ltv: lead.LTV,
    cltv: lead.CLTV,
    loan: {
      requested: lead.RequestedLoanAmountMin,
      max: lead.RequestedLoanAmountMax,
      description: lead.RequestedLoanTypeDescription,
      purpose: lead.RequestedLoanPurposeAbbrv
    },
    property: {
      value: lead.PropertyValue,
      description: lead.PropertyTypeDescription,
      location: lead.PropertyLocation,
      price: lead.PropertyPurchasePrice,
      year: lead.PropertyYearAcquired
    },

    mortgage: {
      totalBalance: lead.MortgagesTotalBalance,

      firstBalance: lead.Mortgage1Balance,
      firstRate: lead.Mortgage1Rate,
      firstType: lead.Mortgage1Type,
      firstPaymentAmount: lead.Mortgage1Payment,

      secondBalance: lead.Mortgage2Balance,
      secondRate: lead.Mortgage2Rate,
      secondType: lead.Mortgage2Type,
      secondPaymentAmount: lead.Mortgage2Payment
    }
  };

  return newLead;
};

export const Leads = mongoose.model('leads', LeadsSchema);
