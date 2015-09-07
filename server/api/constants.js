import _ from 'lodash';
import {logger} from '../util/logger';

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

  logger.log(pattern, props, opts);
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
}
