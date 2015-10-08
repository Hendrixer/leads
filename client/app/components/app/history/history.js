import angular from 'angular';
import uiRouter from 'angular-ui-router';
import History from './history.directive';

const historyModule = angular.module('history', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('history', {
      url: '/history/:broker/:name',
      template: '<history orders="orders" broker="broker"></history>',
      controller: ['orders', '$scope', 'broker', function(orders, $scope, broker) {
        $scope.orders = orders;
        $scope.broker = broker;
      }],

      auth: true,
      resolve: {
        broker: ['$stateParams', 'Brokers', function($stateParams, Brokers) {
          const {broker, name} = $stateParams;

          return Brokers.getOne({name, _id: broker})
            .then(broker => {
              return broker;
            });

        }],

        orders: ['$stateParams', 'Orders', '$state', function($stateParams, Orders, $state) {
          const {broker} = $stateParams;
          if (!broker) {
            $state.go('leads');
            return;
          }

          return Orders.getOrders({broker})
            .then(()=> {
              return Orders.getState()[broker];
            });
        }]
      }
    });
}])
.directive('history', History).name;

export default historyModule;
