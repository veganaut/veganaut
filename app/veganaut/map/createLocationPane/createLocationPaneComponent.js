(function() {
    'use strict';

    angular
        .module('veganaut.app.map')
        .component('vgCreateLocationPane', createLocationPaneComponent());

    /**
     * Component showing a multi-step form for creating a new location.
     */
    function createLocationPaneComponent() {
        var component = {
            bindings: {
                /**
                 * Leaflet map object.
                 */
                map: '<vgMap',

                /**
                 * The CreateLocation model instance used for this form
                 */
                createLocation: '<vgCreateLocation',

                /**
                 * Handler method called when the user aborts creating the location.
                 */
                onAbort: '&vgOnAbort',

                /**
                 * Handler method called when the user submits the location.
                 */
                onSubmit: '&vgOnSubmit'
            },
            controller: CreateLocationPaneComponentController,
            templateUrl: '/veganaut/map/createLocationPane/createLocationPaneComponent.html'
        };

        return component;
    }

    CreateLocationPaneComponentController.$inject = [
        '$scope', 'angularPiwik', 'locationService', 'locationFilterService'
    ];
    function CreateLocationPaneComponentController($scope, angularPiwik, locationService, locationFilterService) {
        var $ctrl = this;

        // Expose location types
        $ctrl.LOCATION_TYPES = locationService.LOCATION_TYPES;

        /**
         * Handles when the user select a location from the geocode search.
         * @param {GeocodeResult} result
         */
        $ctrl.onGeocodeResultSelect = function(result) {
            // Set coordinates according to search result
            $ctrl.createLocation.setNewLocationCoordinates(
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
        $ctrl._mapClickHandler = function(event) {
            $scope.$apply(function() {
                if ($ctrl.createLocation.isPlacingLocation()) {
                    // When placing the location, take the click
                    // as the coordinates of the new location
                    $ctrl.createLocation.setNewLocationCoordinates(
                        event.latlng.lat,
                        event.latlng.lng
                    );

                    angularPiwik.track('map.addLocation', 'mapClick');
                }
            });
        };

        $ctrl.$onInit = function() {
            // Register event handler
            $ctrl.map.on('click', $ctrl._mapClickHandler);
        };

        $ctrl.$onDestroy = function() {
            // De-register event handler
            $ctrl.map.off('click', $ctrl._mapClickHandler);
        };

        // As uib-btn-radio doesn't have a onChange method, we need to do a good old $watch
        $scope.$watch('$ctrl.createLocation.newLocation.type', function() {
            if (angular.isDefined($ctrl.createLocation.newLocation.type)) {
                // Show the type of location on the map that we are about to add
                locationFilterService.setFilters({
                    type: $ctrl.createLocation.newLocation.type
                });
            }
        });
    }
})();
