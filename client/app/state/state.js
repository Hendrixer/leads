import angular from 'angular';
import {LeadFactory} from './leadFactory';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.name;

export default state;
