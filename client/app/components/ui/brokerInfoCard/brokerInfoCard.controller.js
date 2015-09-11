import states from './states';
import timezones from './timezones';
import find from 'lodash/collection/find';

export default class {
  constructor(){
    this.name = this.name || 'create';

    this.states = states;
    this.timezones = timezones;

    this.savedStates = {};
  }
}



