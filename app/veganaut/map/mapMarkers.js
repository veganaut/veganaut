(function() {
    'use strict';

    /**
     * Directive for adding a location markers to a Leaflet map.
     * For initialisation, the provided list of locations is used,
     * after that the directive listens to events to get updates.
     * (This cannot be done with watchers because there would be too
     * many when there are a lot of markers.)
     * @returns {directive}
     */
    var mapMarkersDirective = function() {
        return {
            restrict: 'E',
            scope: {
                locations: '=vgLocations',
                map: '=vgMap',
                onClick: '&?vgOnClick'
            },
            controller: 'vgMapMarkersCtrl',
            controllerAs: 'mapMarkersVm',
            bindToController: true,
            template: ''
        };
    };

    var mapMarkersCtrl = [
        '$scope', 'Leaflet',
        function($scope, L) {
            var vm = this;

            /**
             * Map of location id to marker that was added to the map
             * for that location.
             * @type {{}}
             */
            var markers = {};

            /**
             * Creates a new marker for the given location, adds it to the map
             * and returns it.
             * @param {Location} location
             * @returns {L.marker}
             */
            var createMarker = function(location) {
                // Get the marker definition
                var markerDefinition = location.getMarkerDefinition();

                // Create new marker
                var marker = L.marker(markerDefinition.latLng,
                    markerDefinition.base
                );

                // Register event handler
                marker.on('click', function() {
                    // Pass on to the handler if it's defined
                    if (angular.isDefined(vm.onClick)) {
                        vm.onClick({location: location});
                    }
                });

                // Add it to the map and return it
                vm.map.addLayer(marker);
                return marker;
            };

            /**
             * Updates the marker of the given location,
             * creating it if it doesn't exist yet
             * @param location
             */
            var updateMarker = function(location) {
                // Get the marker definition
                var markerDefinition = location.getMarkerDefinition();
                if (!angular.isArray(markerDefinition.latLng)) {
                    // Can't add a marker if there are no coordinates
                    return;
                }

                // Check if there isn't a marker yet for that location
                if (!angular.isObject(markers[location.id])) {
                    markers[location.id] = createMarker(location);
                }

                // Get marker definition and marker instance
                var marker = markers[location.id];

                // Update the properties
                // TODO: only set the stuff that changed
                marker.setLatLng(markerDefinition.latLng);
                marker.setZIndexOffset(markerDefinition.zIndexOffset);
                marker.setIcon(L.divIcon(markerDefinition.icon));
                marker._icon.title = markerDefinition.title; // This is the only possibility to update the title in Leaflet
            };


            // Listen for newly added locations
            $scope.$on('veganaut.locationSet.location.added', function(event, location) {
                updateMarker(location);
            });

            // Listen for removed locations
            $scope.$on('veganaut.locationSet.location.removed', function(event, location) {
                if (angular.isObject(markers[location.id])) {
                    vm.map.removeLayer(markers[location.id]);
                    delete markers[location.id];
                }
            });

            // Listen for updated locations
            $scope.$on('veganaut.location.marker.updated', function(event, location) {
                updateMarker(location);
            });

            // Initialise the markers for the locations that are already around.
            // The rest will be done through events
            angular.forEach(vm.locations, function(location) {
                updateMarker(location);
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.map')
        .controller('vgMapMarkersCtrl', mapMarkersCtrl)
        .directive('vgMapMarkers', [mapMarkersDirective])
    ;
})();
