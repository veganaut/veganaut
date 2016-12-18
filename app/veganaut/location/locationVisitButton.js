(function() {
    'use strict';

    // Part of the veganaut.app.location module
    var module = angular.module('veganaut.app.location');

    /**
     * Directive that shows a button to navigate to the given location.
     * @returns {directive}
     *
     * @example
     * <vg-location-visit-button vg-location="location"></vg-location-visit-button>
     */
    var locationVisitButtonDirective = function() {
        return {
            restrict: 'E',
            scope: {
                // The location to show the button for
                location: '=vgLocation',

                // Whether to show this as a primary button, defaults to true
                primary: '=?vgIsPrimary'
            },

            controller: ['$location', function($location) {
                var vm = this;

                /**
                 * Routes to the location details page
                 */
                vm.visit = function() {
                    $location.path('location/' + vm.location.id);
                };
            }],
            controllerAs: 'locationVisitButtonVm',
            bindToController: true,
            templateUrl: '/veganaut/location/locationVisitButton.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgLocationVisitButton', [locationVisitButtonDirective]);
})();
