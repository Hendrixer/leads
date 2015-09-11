import './edit_broker.styl';
import template from './edit_broker.html';
import controller from './edit_broker.controller';

const Edit_broker = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {
      broker: '='
    },
    bindToController: true,
    replace: true
  };
};

export default Edit_broker;
