import './<%= name %>.styl';
import template from './<%= name %>.html';
import {<%= upcaseName %>Controller as controller} from './<%= name %>.controller';

const <%= upcaseName %> = ()=> {
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

export {<%= upcaseName %>};
