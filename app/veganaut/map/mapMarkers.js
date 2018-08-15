(function() {
    'use strict';

    /**
     * Directive for adding location items (locations and clusters) to a
     * Leaflet map. For initialisation, the provided list of items is used,
     * after that the directive listens to events to get updates.
     * (This cannot be done with watchers because there would be too
     * many when there are a lot of markers.)
     * @returns {directive}
     */
    var mapMarkersDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * List of location items to display.
                 * the objects must have the following properties:
                 * - id (unique among all location items)
                 * - getMarkerDefinition()
                 */
                locationItems: '=vgLocationItems',
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
             * Map of locationItem id to marker that was added to the map
             * for that locationItem.
             * @type {{}}
             */
            var markers = {};

            /**
             * Map of locationItem id to the boolean value `true` for all
             * location items that were added to the map. Some item can already
             * be added to the map but not yet visible (no map marker) if
             * we don't know yet where they are (used when creating a new location).
             * @type {{}}
             */
            var addedLocationItemIds = {};

            /**
             * Creates a new marker for the given locationItem and returns it.
             * @param {{}} locationItem
             * @returns {L.marker}
             */
            var createMarker = function(locationItem) {
                // Get the marker definition
                var markerDefinition = locationItem.getMarkerDefinition();

                // Create new marker
                var marker = L.marker(markerDefinition.latLng,
                    markerDefinition.base
                );

                // Register event handler
                marker.on('click', function() {
                    console.log('click');
                    // Pass on to the handler if it's defined
                    if (angular.isDefined(vm.onClick)) {
                        vm.onClick({locationItem: locationItem});
                    }
                });

                // Return the marker
                return marker;
            };

            /**
             * Updates the marker of the given locationItem,
             * creating it if it doesn't exist yet
             * @param locationItem
             */
            var updateMarker = function(locationItem) {
                // Get the marker definition
                var markerDefinition = locationItem.getMarkerDefinition();
                if (!angular.isArray(markerDefinition.latLng)) {
                    // Can't add a marker if there are no coordinates
                    return;
                }

                // Check if there isn't a marker yet for that locationItem
                var isNewMarker = false;
                if (!angular.isObject(markers[locationItem.id])) {
                    markers[locationItem.id] = createMarker(locationItem);
                    isNewMarker = true;
                }

                // Get marker definition and marker instance
                var marker = markers[locationItem.id];

                // Update the properties
                // TODO: only set the stuff that changed
                marker.setLatLng(markerDefinition.latLng);
                marker.setZIndexOffset(markerDefinition.zIndexOffset);
                marker.setIcon(L.divIcon(markerDefinition.icon));
                if (angular.isObject(marker._icon)) {
                    // This is the only possibility to update the title in Leaflet
                    // (when the marker is not on the map yet, the _icon is not defined yet).
                    marker._icon.title = markerDefinition.base.title;
                }

                // Add it to the map if it was just created
                if (isNewMarker) {
                    vm.map.addLayer(marker);
                }
            };

            /**
             * Helper for adding a locationItem to the map
             * @param {{}} locationItem
             */
            var addLocationItem = function(locationItem) {
                // Add the item to the list of items, then create/update the marker
                addedLocationItemIds[locationItem.id] = true;
                updateMarker(locationItem);
            };


            // Listen for newly added location items
            $scope.$on('veganaut.locationSet.locationItem.added', function(event, locationItem) {
                addLocationItem(locationItem);
            });

            // Listen for removed location items
            $scope.$on('veganaut.locationSet.locationItem.removed', function(event, locationItem) {
                // Delete the item from the list of added items
                delete addedLocationItemIds[locationItem.id];

                // Remove the marker if there was one
                if (angular.isObject(markers[locationItem.id])) {
                    vm.map.removeLayer(markers[locationItem.id]);
                    delete markers[locationItem.id];
                }
            });

            // Listen for updated location item markers
            $scope.$on('veganaut.locationItem.marker.updated', function(event, location) {
                // Only update the marker if this item was explicitly added
                if (addedLocationItemIds[location.id]) {
                    updateMarker(location);
                }
            });

            // Initialise the markers for the locations that are already around.
            // The rest will be done through events
            angular.forEach(vm.locationItems, addLocationItem);
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.map')
        .controller('vgMapMarkersCtrl', mapMarkersCtrl)
        .directive('vgMapMarkers', [mapMarkersDirective])
    ;
})();
