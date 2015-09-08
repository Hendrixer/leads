import './new_broker.styl';
import template from './new_broker.html';
import {New_brokerController as controller} from './new_broker.controller';

const New_broker = ()=> {
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

export default New_broker;
