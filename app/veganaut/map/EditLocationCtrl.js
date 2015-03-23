(function(module) {
    'use strict';

    module.controller('EditLocationCtrl', [
        '$scope', '$routeParams', '$timeout', 'locationService', 'Location', 'leafletData', 'mapDefaults',
        function($scope, $routeParams, $timeout, locationService, Location, leafletData, mapDefaults) {
            var locationId = $routeParams.id;

            /**
             * The location being edited
             * @type {Location}
             */
            $scope.location = undefined;

            /**
             * Whether the coordinates are being edited
             * TODO: make it possible to switch this off again after it's switched on
             * At the moment that's not the case, because the newly selected coordinates
             * Will be saved anyway.
             * @type {boolean}
             */
            $scope.changeCoordinates = false;

            /**
             * Expose the location types
             * @type {{}}
             */
            $scope.locationTypes = Location.TYPES;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapDefaults = mapDefaults;

            /**
             * Current center of the map
             * @type {{lat: number, lng: number, zoom: number}}
             */
            $scope.center = {
                lat: 0,
                lng: 0,
                zoom: 18 // Zoom in as much as possible to discourage big change
            };

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();

            /**
             * Save the location
             */
            $scope.saveLocation = function() {
                $scope.location.setEditing(false);
                locationService.updateLocation($scope.location);
                $scope.goToView($scope.location.getUrl());
            };

            // Get the location
            locationService.getLocation(locationId).then(function(location) {
                // TODO: handle location not found
                $scope.location = location;
                $scope.center.lat = $scope.location.lat;
                $scope.center.lng = $scope.location.lng;
                location.setEditing(true);

                // Add the marker to the map
                mapPromise.then(function(map) {
                    location.marker.addTo(map);
                });
            });

            // Show the map in the next cycle. This needs to be done
            // because leaflet somehow doesn't like to be initialised
            // while the page is still hidden.
            // TODO: this shouldn't be necessary
            $timeout(function() {
                $scope.showMap = true;
            }, 0);

            /**
             * Sets the given coordinates as the lat/lng of the location
             * that is being added.
             * @param {number} lat
             * @param {number} lng
             */
            $scope.setNewLocationCoordinates = function(lat, lng) {
                // Set the coordinates
                $scope.location.setLatLng(lat, lng);

                // Zoom in all the way to make sure users place it precisely
                // TODO: duplication with MapCtrl
                mapPromise.then(function(map) {
                    var maxZoom = map.getMaxZoom();
                    var zoomTo = [lat, lng];
                    if (map.getZoom() < maxZoom || !map.getBounds().contains(zoomTo)) {
                        map.setView(zoomTo, maxZoom);
                    }
                });
            };

            /**
             * Handler for clicks on the map
             * @param event
             * @param args
             */
            var mapClickHandler = function(event, args) {
                // When adding a new location, take the click
                // as the coordinates of this new location
                $scope.setNewLocationCoordinates(
                    args.leafletEvent.latlng.lat,
                    args.leafletEvent.latlng.lng
                );
            };

            // Register event handlers
            $scope.$on('leafletDirectiveMap.click', mapClickHandler);
        }
    ]);
})(window.veganaut.mapModule);
