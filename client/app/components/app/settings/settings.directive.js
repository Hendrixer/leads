import './settings.styl';
import template from './settings.html';
import controller from './settings.controller';

const settings = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {admin: '='},
    bindToController: true,
    replace: true
  };
};

export default settings;
