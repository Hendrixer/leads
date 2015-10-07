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
      auth: true,
      async: true,
      url: '/preorder/:broker/:name',
      template: '<preorder leads="preorder" broker="broker"></preorder>',
      resolve: {
        preorder: ['Orders', '$stateParams', (Orders, $stateParams) => {
          const {broker} = $stateParams;
          return Orders.preorder(broker, {});
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
.directive('onAllChecked', () => {
  return (scope, element, attr) => {
    var checkBox = element.find('md-checkbox');
    var checkboxScope = checkBox.scope();
    const notifyScope = (e) => {
      scope.$apply(()=> {
        scope.allSelected = checkboxScope.allSelected();
      });
    };

    checkBox.on('click', notifyScope);

    const destroy = scope.$on('$destroy', () => {
      checkBox.off('click', notifyScope);
      destroy();
    });
  };
})
.filter('percent', ['$filter', $filter => {
  return (input, decimals=2) => {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])
.name;

export default preorderModule;
