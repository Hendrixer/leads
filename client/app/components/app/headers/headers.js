import angular from 'angular';
import uiRouter from 'angular-ui-router';
import headers from './headers.directive';

const headersModule = angular.module('headers', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('headers', {
      url: '/headers',
      template: '<headers></headers>'
    });
}])
.directive('headers', headers)
.name;

export default headersModule;
