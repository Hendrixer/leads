import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {Brokers} from './brokers.directive';
import brokerListTemplate from './brokerList.html';

const brokers = angular.module('brokers', [
  uiRouter
])
.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('brokers', {
      url: '/brokers',
      template: '<brokers></brokers>'
    })
    .state('brokers.group', {
      url: '/:letter',
      template: brokerListTemplate,
      controllerAs: 'detail',
      controller: function(brokers) {
        this.brokers = brokers;
        this.search = '';
      },

      resolve: {
        brokers: function(Brokers, $stateParams) {
          const letter = $stateParams.letter;
          const query = {
            'nameStartsWith': letter,
            sort: 'name'
          };

          return Brokers.getBrokers(query)
          .then(()=> {
            return Brokers.getState()[letter];
          });
        }
      }
    });
})
.directive('brokers', Brokers)
.name;

export default brokers;
