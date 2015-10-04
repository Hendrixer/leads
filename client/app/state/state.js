import angular from 'angular';
import {LeadFactory} from './leadFactory';
import {BrokerFactory} from './brokerFactory';
import {OrderFactory} from './orderFactory';
import AuthFactory from './auth';
import {ResolveFactory} from './resolvesFactory';
import {AdminFactory} from './adminFactory';
import PubnubFactory from './pubnub';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.factory('Brokers', BrokerFactory)
.factory('Orders', OrderFactory)
.factory('Resolves', ResolveFactory)
.factory('Auth', AuthFactory)
.factory('Admins', AdminFactory)
.factory('PubNub', PubnubFactory)
.name;

export default state;
