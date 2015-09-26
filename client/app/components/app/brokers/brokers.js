import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {Brokers} from './brokers.directive';
import brokerListTemplate from './brokerList.html';
import brokerListController from './brokerListController';

const brokers = angular.module('brokers', [
  uiRouter
])
.config(['$stateProvider', '$urlRouterProvider',($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('brokers', {
      auth: true,
      url: '/brokers',
      template: '<brokers></brokers>'
    })
    .state('brokers.group', {
      auth: true,
      url: '/:letter',
      async: true,
      template: brokerListTemplate,
      controllerAs: 'detail',
      controller: brokerListController,
      resolve: {
        brokers: ['Brokers', '$stateParams', function(Brokers, $stateParams) {
          const {letter} = $stateParams;
          const query = {
            nameStartsWith: letter,
            sort: 'name',
            select: 'name displayName email'
          };

          return Brokers.getBrokers(query)
          .then(()=> {
            return Brokers.getState()[letter];
          });
        }]
      }
    });
}])
.directive('brokers', Brokers)
.name;

export default brokers;
