export const headers = [
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

export const headersMap = headers.reduce((map, header) => {
  map[header] = true;
  return map;
}, {});
