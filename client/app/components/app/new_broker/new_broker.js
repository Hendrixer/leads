import angular from 'angular';
import uiRouter from 'angular-ui-router';
import New_broker from './new_broker.directive';
import brokerInfoCard from '../../ui/brokerInfoCard/brokerInfoCard';
let new_brokerModule = angular.module('new_broker', [
  uiRouter,
  brokerInfoCard.name
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('new-broker', {
      url: '/new/broker',
      template: '<new-broker></new-broker>'
    });
}])
.directive('newBroker', New_broker).name;

export default new_brokerModule;
