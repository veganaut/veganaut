(function(module) {
    'use strict';

    module.controller('EditLocationCtrl',
        ['$scope', '$routeParams', '$timeout', 'locationService', 'Location', 'leafletData', 'mapDefaults',
            function($scope, $routeParams, $timeout, locationService, Location, leafletData, mapDefaults) {
                var locationId = $routeParams.id;

                $scope.location = undefined;

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
                    zoom: 16
                };


                $scope.saveLocation = function() {
                    locationService.updateLocation($scope.location);
                    $scope.goToView($scope.location.getUrl());
                };

                // Get the location
                locationService.getLocation(locationId).then(function(location) {
                    // TODO: handle location not found
                    $scope.location = location;
                    $scope.center.lat = $scope.location.lat;
                    $scope.center.lng = $scope.location.lng;

                    // Add the marker to the map
                    leafletData.getMap().then(function(map) {
                        location.marker.addTo(map);
                    });

                });


                // Show the map in the next cycle. This needs to be done
                // because leaflet somehow doesn't like to be initialised
                // while the page is still hidden.
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
