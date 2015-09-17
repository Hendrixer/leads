import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preorder from './preorder.directive';

const preorderModule = angular.module('preorder', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('preorder', {
      url: '/preorder',
      template: '<preorder></preorder>'
    });
}])
.directive('preorder', preorder)
.name;

export default preorderModule;
