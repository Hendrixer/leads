import 'ngTableCss';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import preorder from './preorder.directive';
import ngTable from 'angular-material-data-table';

const preorderModule = angular.module('preorder', [
  uiRouter,
  ngTable
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('preorder', {
      url: '/preorder/:broker/:name',
      template: '<preorder leads="preorder" broker="broker"></preorder>',
      resolve: {
        preorder: ['Orders', '$stateParams', (Orders, $stateParams) => {
          const {broker} = $stateParams;
          return Orders.preorder(broker);
        }],

        broker: ['Brokers', '$stateParams', (Brokers, $stateParams) => {
          const {broker, name} = $stateParams;
          return Brokers.getOne({name, _id: broker});
        }]
      },
      controller: ['preorder', 'broker', '$scope', (preorder, broker, $scope) => {
        $scope.broker = broker;
        $scope.preorder = preorder;
      }]
    });
}])
.directive('preorder', preorder)
.name;

export default preorderModule;
