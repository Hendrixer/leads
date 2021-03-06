import './preorder.styl';
import template from './preorder.html';
import controller from './preorder.controller';

const preorder = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {
      leads: '=',
      broker: '='
    },
    bindToController: true,
    replace: true
  };
};

export default preorder;
