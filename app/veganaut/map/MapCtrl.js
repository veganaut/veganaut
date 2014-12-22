(function(module) {
    'use strict';

    // TODO: refactor, document and add tests!!
    module.controller('MapCtrl', ['$scope', '$location', '$timeout', 'leafletData',
        'playerService', 'Location', 'locationService', 'backendService', 'geocodeService',
        function($scope, $location, $timeout, leafletData,
            playerService, Location, locationService, backendService, geocodeService)
        {
            var player;

            /**
             * Locations loaded from the backend indexed by id
             * @type {{}}
             */
            var locations = {};

            /**
             * Whether the user is currently adding a new location
             * @type {boolean}
             */
            $scope.isAddingLocation = false;

            // TODO: all this addLocation stuff should be separated to a directive or other controller
            $scope.addLocationStep = 1;

            $scope.nextStep = function() {
                if ($scope.stepIsValid()) {
                    if ($scope.isLastStep()) {
                        $scope.addNewLocation();
                    }
                    else {
                        $scope.addLocationStep += 1;
                    }
                }
            };

            $scope.previousStep = function() {
                if ($scope.addLocationStep > 1) {
                    $scope.addLocationStep -= 1;
                }
            };

            $scope.stepIsValid = function() {
                var loc = $scope.newLocation;
                switch ($scope.addLocationStep) {
                case 1:
                    return (angular.isString(loc.name) && loc.name.length > 0);
                case 2:
                    return (angular.isString(loc.type) && loc.type.length > 0);
                case 3:
                    return (angular.isNumber(loc.lat) && angular.isNumber(loc.lng));
                default:
                    return false;
                }
            };

            $scope.isLastStep = function() {
                return ($scope.addLocationStep === 3);
            };

            // Expose the location service
            $scope.location = locationService;

            // Expose the map settings
            $scope.mapSettings = locationService.mapSettings;

            /**
             * Expose the location types
             * @type {{}}
             */
            $scope.locationTypes = Location.TYPES;

            /**
             * Empty events object (needed to get the leaflet map to broadcast events)
             * @type {{}}
             */
            $scope.events = {};

            /**
             * Location that is currently being added
             * @type {Location}
             */
            $scope.newLocation = undefined;

            /**
             * Whether the newLocation has already been added to the map
             * @type {boolean}
             */
            var newLocationIsAddedToMap = false;

            /**
             * Starts adding a new location
             */
            $scope.startAddNewLocation = function() {
                $scope.addLocationStep = 1;
                $scope.isAddingLocation = true;
                $scope.newLocation = new Location({team: player.team});
                locationService.activate($scope.newLocation);
            };

            /**
             * Aborts adding a new location
             */
            $scope.resetAddNewLocation = function() {
                locationService.activate();
                // Remove from map if it was added
                if (newLocationIsAddedToMap === true) {
                    var markerToRemove = $scope.newLocation.marker;
                    mapPromise.then(function(map) {
                        map.removeLayer(markerToRemove);
                    });
                }
                $scope.isAddingLocation = false;
                $scope.newLocation = undefined;
                newLocationIsAddedToMap = false;
            };

            /**
             * Finalises adding a new location
             */
            $scope.addNewLocation = function() {
                locationService.submitLocation($scope.newLocation);
                $scope.isAddingLocation = false;
                $scope.newLocation = undefined;
                newLocationIsAddedToMap = false;
            };

            /**
             * Goes to the location view
             * @param location
             */
            $scope.visitLocation = function(location) {
                $location.path('location/' + location.id);
            };

            /**
             * Sets the given coordinates as the lat/lng of the location
             * that is being added.
             * @param {number} lat
             * @param {number} lng
             */
            var setNewLocationCoordinates = function(lat, lng) {
                if ($scope.isAddingLocation) {
                    // Set the coordinates
                    $scope.newLocation.setLatLng(lat, lng);

                    // Push to map if not already there
                    if (newLocationIsAddedToMap !== true) {
                        mapPromise.then(function(map) {
                            $scope.newLocation.marker.on('click', locationClickHandler);
                            $scope.newLocation.marker.addTo(map);
                        });
                        newLocationIsAddedToMap = true;
                    }
                }
            };

            /**
             * Handler for clicks on the map
             * @param event
             * @param args
             */
            var mapClickHandler = function(event, args) {
                if ($scope.isAddingLocation) {
                    // When adding a new location, take the click
                    // as the coordinates of this new location
                    setNewLocationCoordinates(
                        args.leafletEvent.latlng.lat,
                        args.leafletEvent.latlng.lng
                    );
                }
                else {
                    // When not adding a location, deselect currently active location
                    locationService.activate();
                }
            };

            /**
             * Handler for clicks on map markers (Locations)
             * @param event Event coming directly from leaflet
             *      (not angular-leaflet-directive)
             */
            var locationClickHandler = function(event) {
                if (!$scope.isAddingLocation) {
                    var clickedLocation = locations[event.target.locationId];
                    if (clickedLocation) {
                        // Run it through $apply since we are coming directly from Leaflet
                        $scope.$apply(function() {
                            locationService.activate(clickedLocation);
                        });
                    }
                }
            };

            // Register event handlers
            $scope.$on('leafletDirectiveMap.click', mapClickHandler);

            // Get the locations
            locationService.getLocations().then(function(loadedLocations) {
                locations = loadedLocations;
                mapPromise.then(function(map) {
                    // Go through all the locations and add the marker to the map
                    angular.forEach(locations, function(location) {
                        location.marker.on('click', locationClickHandler);
                        location.marker.addTo(map);
                    });
                });
            });

            // Check if we are logged in
            if (backendService.isLoggedIn()) {
                // Get the player
                playerService.getMe().then(function(me) {
                    player = me;
                });
            }

            // Watch the map center for changes to save it
            $scope.$watch('mapSettings.center', function() {
                locationService.saveMapCenter();
            });

            // Geocoding search string model and results
            $scope.geocoding = {
                search: '',
                results: []
            };

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();

            /**
             * Selects the given geocode result as the coordinates
             * for the new location
             * @param {GeocodeResult} result
             */
            $scope.setGeocodeResult = function(result) {
                // Set coordinates
                setNewLocationCoordinates(
                    result.lat,
                    result.lng
                );

                // Fit to the bounds of the result
                if (angular.isArray(result.bounds)) {
                    mapPromise.then(function(map) {
                        map.fitBounds(result.bounds);
                    });
                }
            };

            // Watch the geocoding search string
            var searchTimeout;
            $scope.$watch('geocoding.search', function(search) {
                // TODO: move constants somewhere else
                if (!angular.isString(search) || search.length < 4) {
                    return;
                }

                // Cancel timeout if it's already started
                if (angular.isObject(searchTimeout)) {
                    $timeout.cancel(searchTimeout);
                }

                // Start a timeout to look up the search string
                searchTimeout = $timeout(function() {
                    // Reset results and timeout
                    $scope.geocoding.results = [];
                    searchTimeout = undefined;

                    // Lookup the search string
                    geocodeService.search($scope.geocoding.search)
                        .then(function(data) {
                            $scope.geocoding.results = data;
                        })
                    ;
                }, 500);
            });
        }
    ]);
})(window.veganaut.mapModule);
