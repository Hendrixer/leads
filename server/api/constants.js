import _ from 'lodash';
import {logger} from '../util/logger';

export const constants = {
  propertyTypes: {
    singleFamily: 'single family',
    condo: 'condo',
    multiplex: 'multiplex',
    townHouse: 'town house'
  },

  creditRatings: {
    poor: 'poor',
    fair: 'fair',
    good: 'good',
    excellent: 'excellent'
  },

  loanPurposes: {
    refinanceFirst: 'refinance first',
    refinanceCashOut: 'refinance cash out',
    refinanceFirstFha: 'refinance first fha',
    refinanceFirstVa: 'refinance first va',
    debtConsolidation: 'debt consolidation',
    heloc: 'heloc',
    buyFirstHome: 'buy first home',
    buySecondHome: 'buy second home'
  }
};

export const makeOptionRegex = (opts, type) => {
  let pattern = _.reduce(opts, (_pattern, val, prop) => {
    if (val) {
      pattern += `${prop}|${constants[type][prop]}|`;
    }

    return _pattern;
  }, '^(') + ')';

  return new RegExp(pattern);
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
}
