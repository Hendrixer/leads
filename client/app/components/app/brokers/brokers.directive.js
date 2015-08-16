import './brokers.styl';
import template from './brokers.html';
import {BrokersController as controller} from './brokers.controller';

const Brokers = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {},
    bindToController: true,
    replace: true
  };
};

export {Brokers};
