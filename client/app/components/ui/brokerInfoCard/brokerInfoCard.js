import angular from 'angular';
import BrokerInfoCard from './brokerInfoCard.directive';

const brokerInfoCardModule = angular.module('brokerInfoCard', [])
.directive('brokerInfoCard', BrokerInfoCard)
.animation('.fade', ['$animateCss', ($animateCss) => {
  return {
    enter(element) {
      return $animateCss(element, {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        },
        duration: .3
      })
    }
  }
}])

export default brokerInfoCardModule;
