import './root.styl';
import template from './root.html';
import {RootController as controller} from './root.controller';

const Root = ()=> {
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

export {Root};
