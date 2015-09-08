import './auth.styl';
import template from './auth.html';
import {AuthController as controller} from './auth.controller';

const Auth = ()=> {
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

export {Auth};
