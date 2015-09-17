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
