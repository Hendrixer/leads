import './leads.styl';
import template from './leads.html';
import {LeadsController as controller} from './leads.controller';

const Leads = ()=> {
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

export {Leads};
