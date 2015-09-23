import states from './states';
import timezones from './timezones';
import find from 'lodash/collection/find';
import map from 'lodash/collection/map';
import reduce from 'lodash/collection/reduce';
import merge from 'lodash/object/merge';
export default class {
  constructor() {
    this.name = this.name || 'create';

    this.states = states;
    this.timezones = timezones;

    this.savedStates = {};
    this.broker.leadFilters.detail = this.broker.leadFilters.detail || {
      requestedLoanAmount: {},
      cltv: {},
      ltv: {}
    };
    
    this.loanAmounts = [
      50000,
      100000,
      150000,
      200000,
      300000,
      400000,
      500000,
      600000,
      700000,
      800000,
      900000
    ];
  }

  checkAllStates() {
    this.broker.leadFilters.states = this.broker.leadFilters.states || {};
    const trueStates = {};

    const states = reduce(this.states, (map, state) => {
      map[state.abbrev] = true;
      return map;
    }, trueStates);

    merge(this.broker.leadFilters.states, states);
  }
}
