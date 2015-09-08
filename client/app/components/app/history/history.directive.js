import './history.styl';
import template from './history.html';
import controller from './history.controller';

const History = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {
      orders: '=',
      broker: '='
    },
    bindToController: true,
    replace: true
  };
};

export default History;
