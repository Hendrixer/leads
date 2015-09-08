import './brokerInfoCard.styl';
import template from './brokerInfoCard.html';
import controller from './brokerInfoCard.controller';

const BrokerInfoCard = ()=> {
  return {
    template,
    controller,
    restrict: 'E',
    controllerAs: 'vm',
    scope: {
      broker: '=',
      leadFilters: '=',
      whenDone: '&'
    },
    bindToController: true,
    replace: true
  };
};

export default BrokerInfoCard;
