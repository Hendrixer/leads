import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {Auth} from './auth.directive';
import signinTemplate from './signin.html';
import signupTemplate from './signup.html';

const authModule = angular.module('auth', [
  uiRouter
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('auth', {
      url: '/auth',
      abstract: true,
      template: '<auth></auth>'
    })
    .state('auth.signin', {
      url: '/signin',
      template: signinTemplate
    })
    .state('auth.signup', {
      url: '/signup',
      template: signupTemplate
    });
}])
.directive('auth', Auth).name;

export default authModule;
