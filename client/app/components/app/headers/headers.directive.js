import './headers.styl';
import template from './headers.html';
import controller from './headers.controller';

const headers = ()=> {
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

export default headers;
