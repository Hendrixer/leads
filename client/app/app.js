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
import settings from './components/app/settings/settings';
import headers from './components/app/headers/headers';
import animate from 'angular-animate';
import 'raygun4js';

Raygun.init($raygunApiKey).attach();

angular.module('app', [
  /* 3rd party */
  ngMaterial,
  uiRouter,
  animate,
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
  preorder,
  settings,
  headers
])
.run(['$mdToast', '$state', 'Auth', '$rootScope', 'Admins', ($mdToast, $state, Auth, $rootScope, Admins) => {
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

  Admins.getMe()
  .then(admin => {
    $rootScope.theme = admin.settings.theme;
  });
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
  const themes = [
    {name: 'default', pri: 'red', alt: 'indigo'},
    {name: 'sunrise', pri: 'yellow', alt: 'deep-orange'},
    {name: 'tron', pri: 'blue-grey', alt: 'cyan'},
    {name: 'cotton-candy', pri: 'indigo', alt: 'pink'},
    {name: 'plum', pri: 'deep-purple', alt: 'purple'},
    {name: 'forest', pri: 'green', alt: 'brown'},
    {name: 'fire', pri: 'amber', alt: 'red'},
    {name: 'sea-life', pri: 'teal', alt: 'blue'}
  ];

  themes.forEach(theme => {
    $mdThemingProvider.theme(theme.name)
      .primaryPalette(theme.pri)
      .accentPalette(theme.alt);
  });
  $mdThemingProvider.alwaysWatchTheme(true);
}]);
