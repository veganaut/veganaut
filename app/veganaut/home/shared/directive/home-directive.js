(function() {
    'use strict';

    /**
     * Component for the home page.
     * @returns {directive}
     */
    var homeDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgHomeCtrl',
            controllerAs: 'homeVm',
            bindToController: true,
            templateUrl: '/veganaut/home/home.tpl.html'
        };
    };
    angular.module('veganaut.app.home')
        .directive('vgHome', [homeDirective])
    ;
})();