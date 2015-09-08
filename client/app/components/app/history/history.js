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
      controller: ['orders', '$scope', 'broker', function(orders, $scope, broker){
        $scope.orders = orders;
        $scope.broker = broker;
      }],

      resolve: {
        broker: ['$stateParams', 'Brokers', function($stateParams, Brokers) {
          const {broker, name} = $stateParams;

          return _.find(Brokers.getState()[name[0].toLowerCase()], {_id: broker});

        }],
        orders: ['$stateParams', 'Orders', function($stateParams, Orders) {
          const {broker} = $stateParams;

          return Orders.getOrders({broker})
            .then(()=> {
              return Orders.getState()[broker];
            })
        }]
      }
    })
}])
.directive('history', History).name;

export default historyModule;
