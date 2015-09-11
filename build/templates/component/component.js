import angular from 'angular';
import uiRouter from 'angular-ui-router';
import <%= name %> from './<%= name %>.directive';

const <%= name %>Module = angular.module('<%= name %>', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('<%= name %>', {
      url: '/<%= name %>',
      template: '<></>'
    })
}])
.directive('<%= name %>', <%= name %>)
.name;

export default <%= name %>Module;
