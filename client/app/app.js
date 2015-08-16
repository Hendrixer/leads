import 'angular-material/angular-material.min.css';
import './app.styl';
import ngMaterial from 'angular-material';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import state from './state/state';
import root from './components/app/root/root';
import leads from './components/app/leads/leads';

angular.module('app', [
  /* 3rd party */
  ngMaterial,
  uiRouter,
  /* factories */
  state,

  /* components */
  root,
  leads
])
.config($mdThemingProvider => {
  $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('cyan');
});
