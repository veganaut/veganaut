(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * Layout directive for showing a tag badge.
     *
     * @returns {directive}
     *
     * @example
     * <vg-tag vg-count="5">
     *     Tag content
     * </vg-tag>
     */
    var tagDirective = function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                /**
                 * Optional count, showing how many times this tag was given.
                 */
                count: '=?vgCount'
            },

            controller: angular.noop,
            controllerAs: 'tagVm',
            bindToController: true,
            templateUrl: '/components/ui/tag/tag.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgTag', [tagDirective]);
})();
