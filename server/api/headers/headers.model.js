import mongoose from 'mongoose';
const {Schema} = mongoose;
const defaults = [
  'ContactFirstName',
  'ContactLastName',
  'ContactAddress1',
  'ContactCity',
  'ContactStateOrProvince',
  'ContactPostalCode',
  'ContactHomePhone',
  'ContactWorkPhone',
  'ContactEmail',
  'BestContactTimeDescription',
  'HomeOwnerYesNo',
  'CreditRatingDescription',
  'LTV',
  'CLTV',
  'RequestedLoanAmountMin',
  'RequestedLoanAmountMax',
  'RequestedLoanTypeDescription',
  'RequestedLoanPurposeAbbrv',
  'PropertyValue',
  'PropertyTypeDescription',
  'PropertyLocation',
  'PropertyPurchasePrice',
  'PropertyYearAcquired',
  'MortgagesTotalBalance',
  'Mortgage1Balance',
  'Mortgage1Rate',
  'Mortgage1Payment',
  'Mortgage2Balance',
  'Mortgage2Rate',
  'Mortgage2Payment'
];

const HeadersSchema = new Schema({
  broker: {
    type: Schema.Types.ObjectId,
    ref: 'brokers',
    requried: true
  },

  hasDefaultHeaders: {
    type: Boolean,
    default: false
  },

  fileHeaders: defaults.reduce((map, header) => {
    map[header] = String;
    return map;
  }, {})
});

export const Headers = mongoose.model('headers', HeadersSchema);
