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
  history
])
.config($mdThemingProvider => {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('cyan');
});
