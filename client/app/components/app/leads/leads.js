import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngUpload from 'ng-file-upload';
import {Leads} from './leads.directive';
import dashCard from '../../ui/dashCard/dashCard';
import ngTable from 'angular-material-data-table';

const leads = angular.module('leads', [
  uiRouter,
  ngUpload,
  dashCard,
  ngTable
])
.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider
    .otherwise('/leads');

  $stateProvider
    .state('leads', {
      auth: true,
      url: '/leads',
      template: `<leads></leads>`
    });
}])
.directive('leads', Leads)
.name;

export default leads;
