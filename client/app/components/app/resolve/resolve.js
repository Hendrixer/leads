import angular from 'angular';
import uiRouter from 'angular-ui-router';
import resolve from './resolve.directive';

const resolveModule = angular.module('resolve', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('resolve', {
      url: '/resolve/:id',
      auth: true,
      template: '<resolve resolution="resolution"></resolve>',
      resolve: {
        resolution: ['$stateParams', 'Resolves', ($stateParams, Resolves) => {
          const {id} = $stateParams;
          return Resolves.getOne(id)
          .then(()=> {
            return Resolves.getState()[id];
          });
        }]
      },
      controller: ['$scope', 'resolution', ($scope, resolution) => {
        $scope.resolution = resolution;
      }]
    });
}])
.directive('resolve', resolve)
.name;

export default resolveModule;
