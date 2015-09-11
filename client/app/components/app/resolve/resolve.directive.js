import './resolve.styl';
import template from './resolve.html';
import controller from './resolve.controller';

const resolve = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {
      resolution: '='
    },
    bindToController: true,
    replace: true
  };
};

export default resolve;
