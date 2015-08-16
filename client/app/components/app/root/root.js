import angular from 'angular';
import {Root} from './root.directive';

const root = angular.module('root', [])
.directive('app', Root).name;

export default root;




