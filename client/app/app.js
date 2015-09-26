import 'ngMaterial.css';
import './app.styl';
import 'ngTableCss';
import ngMaterial from 'angular-material';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import state from './state/state';
import root from './components/app/root/root';
import leads from './components/app/leads/leads';
import brokers from './components/app/brokers/brokers';
import new_broker from './components/app/new_broker/new_broker';
import edit_broker from './components/app/edit_broker/edit_broker';
import history from './components/app/history/history';
import auth from './components/app/auth/auth';
import resolve from './components/app/resolve/resolve';
import preorder from './components/app/preorder/preorder';
import 'raygun4js';

Raygun.init($raygunApiKey).attach();

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
  auth,
  edit_broker,
  resolve,
  preorder
])
.run(['$mdToast', '$state', 'Auth', '$rootScope', ($mdToast, $state, Auth, $rootScope) => {
  $rootScope.showLoader = false;
  $rootScope.$on('$stateChangeStart', (e, toState) => {
    if (toState.auth && !Auth.isAuth()) {
      e.preventDefault();
      $state.go('auth.signin');
      return;
    }

    if (toState.async && !$rootScope.showLoader) {
      $rootScope.showLoader = true;
    }
  });

  const stopLoader = (e, toState) => {
    if (toState.async && $rootScope.showLoader) {
      $rootScope.showLoader = false;
    }
  };

  $rootScope.$on('$stateChangeSuccess', stopLoader);
  $rootScope.$on('$stateChangeError', stopLoader);
}])
.config(['$mdThemingProvider', '$httpProvider', '$provide', ($mdThemingProvider, $httpProvider, $provide) => {
  $provide.decorator('$exceptionHandler', ['$delegate', '$log', ($delegate, $log) => {
    return (exception, cause) => {
      if (process.env.NODE_ENV === 'production') {
        $log.debug('Sending error to Raygun');
        Raygun.send(exception);
      }

      $delegate(exception, cause);
    };
  }]);

  $httpProvider.interceptors.push(['$q', '$injector', ($q, $injector)=> {
    return {
      request(config) {
        const token = window.localStorage.getItem('leads.token');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },

      responseError(reason) {
        if (reason.status === 401) {
          const state = $injector.get('$state');
          const stateToGoTo = state.$current.name === 'auth.signup' ?
          'auth.signup' : 'auth.signin';

          state.go(stateToGoTo);
          window.localStorage.removeItem('leads.token');
        }

        return $q.reject(reason);
      }
    };
  }]);

  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('purple');
}]);
