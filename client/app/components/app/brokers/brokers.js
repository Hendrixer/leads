import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Brokers from './brokers.directive';

let brokersModule = angular.module('brokers', [
  uiRouter
])
.directive('brokers', Brokers);

export {brokersModule};
