(function() {
    'use strict';

    // Part of the veganaut.app.location module
    var module = angular.module('veganaut.app.location');

    /**
     * Directive for showing the name and main icons of a location.
     * Optional parameter iconsRight determines whether the icons are
     * floated on the right (default) or simply inline next to the title.
     *
     * @returns {directive}
     *
     * @example
     * <vg-location-title
     *  vg-location="location"
     *  vg-icons-right="false">
     * </vg-location-title>
     */
    var locationTitleDirective = function() {
        return {
            restrict: 'E',
            scope: {
                // The location to show the title and icons for
                location: '=vgLocation',

                // Whether the icons should be moved to the right.
                // Defaults to true
                _iconsRight: '=?vgIconsRight'
            },

            controller: [function() {
                var vm = this;

                /**
                 * Whether the icons should be shown on the right
                 * @returns {boolean}
                 */
                vm.showIconsRight = function() {
                    // Check if given as parameter
                    if (angular.isDefined(vm._iconsRight)) {
                        return !!vm._iconsRight;
                    }

                    // Default to true
                    return true;
                };
            }],
            controllerAs: 'locationTitleVm',
            bindToController: true,
            templateUrl: '/veganaut/location/locationTitle.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgLocationTitle', [locationTitleDirective]);
})();
