import './<%= name %>.styl';
import template from './<%= name %>.html';
import controller from './<%= name %>.controller';

const <%= name %> = ()=> {
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

export default <%= name %>;
