import './dashCard.styl';
import template from './dashCard.html';
import _ from 'lodash';

const DashCard = ($timeout)=> {
  return {
    template,
    restrict: 'E',
    scope: {
      type: '=',
      chartData: '='
    },
    replace: true,
    link(scope, element, attr) {

    }
  };
};

export {DashCard};
