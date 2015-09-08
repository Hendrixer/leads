import angular from 'angular';
import BrokerInfoCard from './brokerInfoCard.directive';

const brokerInfoCardModule = angular.module('brokerInfoCard', [])
.directive('brokerInfoCard', BrokerInfoCard);

export default brokerInfoCardModule;
