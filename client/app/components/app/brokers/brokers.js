import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {Brokers} from './brokers.directive';

const brokers = angular.module('brokers', [
  uiRouter
])
.config($stateProvider => {
  $stateProvider
    .state('brokers', {
      url: '/brokers',
      template: '<brokers></brokers>'
    })
})
.directive('brokers', Brokers)
.name;

export default brokers;
