import angular from 'angular';
import {LeadFactory} from './leadFactory';
import {BrokerFactory} from './brokerFactory';
import {OrderFactory} from './orderFactory';
import AuthFactory from './auth';
import {ResolveFactory} from './resolvesFactory';
import {AdminFactory} from './adminFactory';
import {CsvFactory} from './csvFactory';
import {HeaderFactory} from './headerFactory';
import {NotesFactory} from './notesFactory';

const state = angular.module('state', [])
.factory('Leads', LeadFactory)
.factory('Brokers', BrokerFactory)
.factory('Orders', OrderFactory)
.factory('Resolves', ResolveFactory)
.factory('Auth', AuthFactory)
.factory('Admins', AdminFactory)
.factory('Csv', CsvFactory)
.factory('Headers', HeaderFactory)
.factory('Notes', NotesFactory)
.name;

export default state;
