import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngUpload from 'ng-file-upload';
import {Leads} from './leads.directive';
import dashCard from '../../ui/dashCard/dashCard';

const leads = angular.module('leads', [
  uiRouter,
  ngUpload,
  dashCard
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
