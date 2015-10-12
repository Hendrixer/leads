import keys from 'lodash/object/keys';
import map from 'lodash/collection/map';

export const headers = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  Email: 'email',
  Street: 'address.street',
  City: 'address.city',
  State: 'address.state',
  Zip: 'address.zip',
  'Phone Home': 'phone.home',
  'Phone Work': 'phone work',
  'Best Time To Contact': 'bestTimeToContact',
  'Home Owner': 'homeOwner',
  'Credit Rating': 'creditRating',
  LTV: 'LTV',
  CLTV: 'CLTV',
  'Requested Loan Min': 'requestedLoan.amountMin',
  'Requested Loan Max': 'requestedLoan.amountMax',
  'Requested Loan Description': 'requestedLoan.description',
  'Requested Loan purpose': 'requestedLoan.purpose',
  'Property Value': 'property.value',
  'Property Description': 'property.description',
  'Property Location': 'property.location',
  'Property Purchase Price': 'property.purchasePirce',
  'Property Year Acquired': 'property.yearAcquired',
  'Mortgage Total Balance': 'mortgage.totalBalance',
  'First Mortgage Balance': 'mortgage.first.balance',
  'First Mortgage Rate': 'mortgage.first.rate',
  'First Mortgage Payment': 'mortgage.first.payment',
  'Second Mortgage Balance': 'mortgage.second.balance',
  'Second Mortgage Rate': 'mortgage.second.rate',
  'Second Mortgage payment': 'mortgage.second.payment'
};

export const headerKeys = keys(headers);

export const getValueForPropChain = (prop, data) => {
  const key = headers[prop];

  const keys = key.split('.');
  if (keys.length === 1) {
    return data[key];
  } else {
    for (let i = 0; i < keys.length; i++) {
      if (data[keys[i]]) {
        data = data[keys[i]];
      } else {
        if (typeof data === 'object') {
          data = 'null';
        }

        break;
      }
    }

    return data;
  }
};

export const makeDataReadyForCsv = (data) => {
  return map(data, row => {
    return map(headers, (key, header) => {
      return getValueForPropChain(header, row);
    });
  });
};

export const startDownload = (csv, filename) => {
  const link = document.createElement('a');

  const csvData = new Blob([csv], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvData);

  link.setAttribute('href', csvUrl);
  link.setAttribute('download', filename);
  link.click();
};

export const formatAndDownloadCsv = (data, filename) => {
  const csv = Papa.unparse({
    fields: headerKeys,
    data: makeDataReadyForCsv(data)
  });

  startDownload(csv, filename);
};
