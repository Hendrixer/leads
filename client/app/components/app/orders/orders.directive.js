import './orders.styl';
import template from './orders.html';
import {OrdersController as controller} from './orders.controller';

const Orders = ()=> {
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

export {Orders};
