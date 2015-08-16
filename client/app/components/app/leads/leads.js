import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngUpload from 'ng-file-upload';
import {Leads} from './leads.directive';

const leads = angular.module('leads', [
  uiRouter,
  ngUpload
])
.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider
    .otherwise('/leads');

  $stateProvider
    .state('leads', {
      url: '/leads',
      template: `<leads></leads>`
    });
})
.directive('leads', Leads)
.name;

export default leads;
