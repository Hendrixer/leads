import angular from 'angular';
import {DashCard} from './dashCard.directive';

const dashCard = angular.module('dashCard', [])
.directive('dashCard', DashCard)
.name

export default dashCard;
