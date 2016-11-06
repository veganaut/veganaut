(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * Layout directive for showing content directly below the nav bar
     * in an overlay above other content.
     * TODO: expand this directive to be more versatile (at close button, title, ...)
     *
     * @returns {directive}
     *
     * @example
     * <vg-overlay>
     *     Overlay content
     * </vg-overlay>
     */
    var overlayDirective = function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},

            controller: angular.noop,
            controllerAs: 'overlayVm',
            bindToController: true,
            // TODO: style "overlay" directly instead of using classes?
            // TODO: is this component still used? useful? too many things: top-box/overlay/modal
            template: '<div class="overlay top-box container main-container" ng-transclude></div>'
        };
    };

    // Expose as directive
    module.directive('vgOverlay', [overlayDirective]);
})();
