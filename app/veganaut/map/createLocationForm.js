(function() {
    'use strict';

    /**
     * Component showing a multi-step form for creating a new location.
     * @returns {directive}
     */
    var createLocationFormDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Leaflet map object.
                 */
                map: '=vgMap',

                /**
                 * The CreateLocation model instance used for this form
                 */
                createLocation: '=vgCreateLocation',

                /**
                 * Handler method called when the user aborts creating the location.
                 */
                onAbort: '&vgOnAbort',

                /**
                 * Handler method called when the user submits the location.
                 */
                onSubmit: '&vgOnSubmit'
            },
            link: function(scope, el, attrs, vm) {
                // Register event handlers
                vm.map.on('click', vm._mapClickHandler);

                // Remove on $destroy
                scope.$on('$destroy', function() {
                    vm.map.off('click', vm._mapClickHandler);
                });
            },
            controller: 'vgCreateLocationFormCtrl',
            controllerAs: 'createLocationFormVm',
            bindToController: true,
            templateUrl: '/veganaut/map/createLocationForm.tpl.html'
        };
    };

    var createLocationFormCtrl = [
        '$scope', 'angularPiwik', 'locationService',
        function($scope, angularPiwik, locationService)
        {
            var vm = this;

            // Expose location types
            vm.LOCATION_TYPES = locationService.LOCATION_TYPES;

            /**
             * Handles when the user select a location from the geocode search.
             * @param {GeocodeResult} result
             */
            vm.onGeocodeResultSelect = function(result) {
                // Set coordinates according to search result
                vm.createLocation.setNewLocationCoordinates(
                    result.lat,
                    result.lng
                );

                angularPiwik.track('map.addLocation', 'searchResultClick');
            };

            /**
             * Handler for clicks on the map
             * @param event
             * @private
             */
            vm._mapClickHandler = function(event) {
                $scope.$apply(function() {
                    if (vm.createLocation.isPlacingLocation()) {
                        // When adding a new location, take the click
                        // as the coordinates of this new location
                        vm.createLocation.setNewLocationCoordinates(
                            event.latlng.lat,
                            event.latlng.lng
                        );

                        angularPiwik.track('map.addLocation', 'mapClick');
                    }
                    // TODO: else what? We are adding a location but clicked one -> should show some info of the clicked place
                });
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.map')
        .controller('vgCreateLocationFormCtrl', createLocationFormCtrl)
        .directive('vgCreateLocationForm', [createLocationFormDirective])
    ;
})();
