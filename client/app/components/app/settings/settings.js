import angular from 'angular';
import uiRouter from 'angular-ui-router';
import settings from './settings.directive';

const settingsModule = angular.module('settings', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('settings', {
      url: '/settings',
      template: '<settings admin="vm.user"></settings>',
      controller(user) {
        this.user = user;
      },

      controllerAs: 'vm',
      async: true,
      resolve: {
        user: ['Admins', Admins => {
          return Admins.getMe();
        }]
      }
    });
}])
.directive('settings', settings)
.name;

export default settingsModule;
