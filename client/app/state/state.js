import angular from 'angular';
import {LeadFactory} from './leadFactory';
import {BrokerFactory} from './brokerFactory';
import {OrderFactory} from './orderFactory';
import PusherFactory from './pusher';
import AuthFactory from './auth';
import {ResolveFactory} from './resolvesFactory';
import {AdminFactory} from './adminFactory';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.factory('Brokers', BrokerFactory)
.factory('Orders', OrderFactory)
.factory('Pusher', PusherFactory)
.factory('Auth', AuthFactory)
.factory('Admins', AdminFactory)
.name;

export default state;
