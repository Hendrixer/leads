import angular from 'angular';
import uiRouter from 'angular-ui-router';
import resolve from './resolve.directive';

const resolveModule = angular.module('resolves', [])
.config(['$stateProvider', $stateProvider => {
  $stateProvider.state('resolves', {
    url: '/resolves/:id',
    auth: true,
    async: true,
    template: '<resolve resolution="data"></resolve>',
    resolve: {
      data: ['$stateParams', 'Resolves', function($stateParams, Resolves) {
        const {id} = $stateParams;
        return Resolves.getOne(id)
        .then(()=> {
          return Resolves.getState()[id];
        });
      }]
    },
    controller: ['$scope', 'data', ($scope, data) => {
      $scope.data = data;
    }]
  });
}])
.directive('resolve', resolve)
.name;

export default resolveModule;
