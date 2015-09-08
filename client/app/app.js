import 'ngMaterial.css';
import './app.styl';
import ngMaterial from 'angular-material';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import state from './state/state';
import root from './components/app/root/root';
import leads from './components/app/leads/leads';
import brokers from './components/app/brokers/brokers';
import new_broker from './components/app/new_broker/new_broker';
import history from './components/app/history/history';
import auth from './components/app/auth/auth';


angular.module('app', [
  /* 3rd party */
  ngMaterial,
  uiRouter,
  /* factories */
  state,

  /* components */
  root,
  leads,
  brokers,
  new_broker,
  history,
  auth
])
.run(['Pusher', '$mdToast', '$state', 'Auth', '$rootScope', (Pusher, $mdToast, $state, Auth, $rootScope) => {
  Pusher.uploadOn('processing:finished', data => {
    $mdToast.show(
      $mdToast.simple()
        .content('Files done processing')
        .position('bottom right')
        .hideDelay(30000)
    );
  });

  $rootScope.$on('$stateChangeStart', (e, toState) => {
    console.log('hey', Auth.isAuth())
    if (!toState.free && !Auth.isAuth()) {
      e.preventDefault();
      $state.go('auth.signin');
    }
  });
}])
.config(['$mdThemingProvider', '$httpProvider', ($mdThemingProvider, $httpProvider) => {
  $httpProvider.interceptors.push(()=> {
    return {
      request(config){
        const token = window.localStorage.getItem('leads.token');
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      }
    }
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('cyan');
}]);
