import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Edit_broker from './edit_broker.directive';
import find from 'lodash/collection/find';

let edit_brokerModule = angular.module('edit_broker', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('edit-broker', {
      url: '/edit/broker/:broker/:name',
      template: '<edit-broker broker="broker"></edit-broker>',
      resolve: {
        broker: ['$stateParams', 'Brokers', ($stateParams, Brokers) => {
          const {broker, name} = $stateParams;

          return Brokers.getOne({name, _id: broker})
            .then(broker => {
              return broker;
            });
        }]
      },
      controller: ['broker', '$scope', (broker, $scope) => {
        $scope.broker = broker;
      }]
    });
}])
.directive('editBroker', Edit_broker).name;

export default edit_brokerModule;
