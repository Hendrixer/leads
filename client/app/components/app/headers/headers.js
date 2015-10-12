import angular from 'angular';
import uiRouter from 'angular-ui-router';
import headers from './headers.directive';
import ngDrag from './dnd';

const headersModule = angular.module('headers', [
  uiRouter,
  ngDrag
])
.config(['$stateProvider', $stateProvider => {
  $stateProvider
    .state('headers', {
      url: '/headers',
      template: '<headers></headers>'
    });
}])
.directive('headers', headers)
.directive('dragOver', ()=> {
  return ($scope, element, attr) => {
    const cssClass = attr.dragOver;
    const onDragOver = (e) => {
      if (!element.hasClass(cssClass)) {
        element.addClass(cssClass);
      }
    };

    const onDragOut = (e) => {
      if (element.hasClass(cssClass)) {
        element.removeClass(cssClass);
      };
    };

    element.on('dragenter', onDragOver);
    element.on('dragover', onDragOver);
    element.on('dragleave', onDragOut);
    element.on('drop', onDragOut);

    const $destroy = $scope.$on('$destroy', () => {
      element.off('dragenter', onDragOver);
      element.off('dragleave', onDragOut);
      element.off('dragover', onDragOver);
      element.off('drop', onDragOut);
      $destroy();
    });
  };
})
.name;

export default headersModule;
