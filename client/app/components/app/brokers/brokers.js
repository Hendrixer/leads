import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {Brokers} from './brokers.directive';

const brokers = angular.module('brokers', [
  uiRouter
])
.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('brokers', {
      abstract: true,
      url: '/brokers',
      template: '<brokers></brokers>'
    })
    .state('brokers.group', {
      url: '/:letter',
      template: `
        <div ng-repeat="broker in detail.brokers track by broker._id">
          <h3>{{ broker.displayName }}</h3>
        </div>
      `,
      controllerAs: 'detail',
      controller: function(brokers) {
        this.brokers = brokers;
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
    })

  $urlRouterProvider.when('/brokers', ($state) => {
    $state.go('brokers', { letter: 'a' });
  });
})
.directive('brokers', Brokers)
.name;

export default brokers;
