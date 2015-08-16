import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= upcaseName %> from './<%= name %>.directive';

let <%= name %>Module = angular.module('<%= name %>', [
  uiRouter
])
.directive('<%= name %>', <%= upcaseName %>);

export {<%= name %>Module};
