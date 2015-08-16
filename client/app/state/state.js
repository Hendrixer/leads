import angular from 'angular';
import {LeadFactory} from './leadFactory';
import {BrokerFactory} from './brokerFactory';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.factory('Brokers', BrokerFactory)
.name;

export default state;
