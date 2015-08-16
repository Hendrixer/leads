import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Orders from './orders.directive';

let ordersModule = angular.module('orders', [
  uiRouter
])
.directive('orders', Orders);

export {ordersModule};
