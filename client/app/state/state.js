import angular from 'angular';
import {LeadFactory} from './leadFactory';
import {BrokerFactory} from './brokerFactory';
import {OrderFactory} from './orderFactory';
import PusherFactory from './pusher';
import AuthFactory from './auth';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.factory('Brokers', BrokerFactory)
.factory('Orders', OrderFactory)
.factory('Pusher', PusherFactory)
.factory('Auth', AuthFactory)
.name;

export default state;
