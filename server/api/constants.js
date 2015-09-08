import _ from 'lodash';
import {logger} from '../util/logger';
import es from 'event-stream';
import jsonToCsv from 'json-csv';

export const constants = {
  propertyTypes: {
    singleFamily: 'single family',
    'single family': 'single family',
    condo: 'condo',
    multiplex: 'multiplex',
    townHouse: 'town house',
    'town house': 'town house'
  },

  creditRatings: {
    poor: 'poor',
    fair: 'fair',
    good: 'good',
    excellent: 'excellent'
  },

  loanPurposes: {
    refinanceFirst: 'refinance first',
    'refinance first': 'refinance first',
    refinanceCashOut: 'refinance cash out',
    'refinance cash out': 'refinance cash out',
    refinanceFirstFha: 'refinance first fha',
    'refinance first fha': 'refinance first fha',
    refinanceFirstVa: 'refinance first va',
    'refinance first va': 'refinance first va',
    debtConsolidation: 'debt consolidation',
    'debt consolidation': 'debt consolidation',
    heloc: 'heloc',
    buyFirstHome: 'buy first home',
    'buy first home': 'buy first home',
    buySecondHome: 'buy second home',
    'buy second home': 'buy second home'
  }
};


export const getMaps = ()=> {
  const loanPurposes = constants.loanPurposes;
  const creditRatings = constants.creditRatings;
  const propertyTypes = constants.propertyTypes;
  return {loanPurposes, creditRatings, propertyTypes};
};

export const makeOptionRegex = (opts, type) => {
  const props = _.uniq(_.reduce(opts, (list, val, prop)=> {
    if (val) {
      list.push(constants[type][prop]);
    }
    return list;
  }, []));

  let pattern = _.reduce(props, (_pattern, prop, i) => {
    _pattern += `${prop}`;

    if (props[i+1]){
      _pattern += '|';
    }
    return _pattern;
  }, '^(') + ')';
  return new RegExp(pattern, 'gi');
};

export const validator = (type)=> {
  const whiteList = constants[type] || {};

  const whiteListMap = _.reduce(whiteList, (list, val) => {
    list[val] = true;
    return list
  }, {});

  return function(val) {
    return !!(val in whiteListMap)
  };
};

export const csvHeaders = [
  {
    name: 'age',
    label: 'Age'
  },
  {
    name: 'firstName',
    label: 'First Name'
  },
  {
    name: 'lastName',
    label: 'Last Name'
  },
  {
    name: 'address.street',
    label: 'Address Street'
  },
  {
    name: 'address.city',
    label: 'Address State'
  },
  {
    name: 'address.state',
    label: 'Address State'
  },
  {
    name: 'address.zip',
    label: 'Address Zip'
  },
  {
    name: 'phone.home',
    label: 'Home Phone'
  },
  {
    name: 'phone.work',
    label: 'Work Phone'
  },
  {
    name: 'email',
    label: 'Email'
  },
  {
    name: 'bestTimeToContact',
    label: 'Best Time To Contact'
  },
  {
    name: 'homeOwner',
    label: 'Home Owner'
  },
  {
    name: 'creditRating',
    label: 'Credit Rating'
  },
  {
    name: 'LTV',
    label: 'LTV'
  },
  {
    name: 'CLTV',
    label: 'CLTV'
  },
  {
    name: 'requestedLoan.amountMin',
    label: 'Requested Amount Min'
  },
  {
    name: 'requestedLoan.amountMax',
    label: 'Requested Amount Max'
  },
  {
    name: 'requestedLoan.description',
    label: 'Requested Loan Dedscription'
  },
  {
    name: 'requestedLoan.purpose',
    label: 'Requested Loan Purpose'
  },
  {
    name: 'property.value',
    label: 'Property value'
  },
  {
    name: 'property.description',
    label: 'Property Description'
  },
  {
    name: 'property.locaton',
    label: 'Property Location'
  },
  {
    name: 'property.purchasePrice',
    label: 'Property Purchase Price'
  },
  {
    name: 'property.yearAcquired',
    label: 'Property Year Acquired'
  },
  {
    name: 'mortgage.totalBalance',
    label: 'Mortgage Total Balance'
  },
  {
    name: 'mortage.first.balance',
    label: 'First Mortgage Balance'
  },
  {
    name: 'mortgage.first.rate',
    label: 'First Mortgage Rate'
  },
  {
    name: 'mortgage.first.payment',
    label: 'First Mortgage Balance'
  },
  {
    name: 'mortage.second.balance',
    label: 'Second Mortgage Balance'
  },
  {
    name: 'mortgage.second.rate',
    label: 'Second Mortgage Rate'
  },
  {
    name: 'mortgage.second.payment',
    label: 'Second Mortgage Balance'
  },

];

const makeCsv = (res, data)=> {
  const options = {
    fields: csvHeaders
  };

  const source = es.readArray(data.leads);
  const name = data.broker.name.replace(/\s/g, '');
  const date = new Date().toLocaleDateString().replace(/\//g, '-');
  const filename = `${name}-${date}.csv`;

  res.attachment(filename);
  source
    .pipe(jsonToCsv.csv(options))
    .pipe(res);
}

const makePdf = (res, data) => {
  res.send({message: 'PDFs not supoorted yet'});
}

const makeText = (res, data) => {
  res.send({message: 'Text files not supoorted yet'});
}

export const downloadFile = (res, filetype, data) => {
  if (/csv/g.test(filetype)) {
    makeCsv(res, data);
  } else if (/text|txt/g.test(filetype)) {
    makeText(res, data);
  } else if(/pdf/g.test(filetype)) {
    makePdf(res, data);
  } else {
    res.send({message: 'Email Scott'});
  }
};
