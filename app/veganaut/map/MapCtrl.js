(function(module) {
    'use strict';

    // TODO: refactor (it's getting way too big!), document and add tests!!
    module.controller('MapCtrl', [
        '$scope', '$location', '$timeout', 'leafletData', 'angularPiwik', 'mapDefaults',
        'playerService', 'Location', 'locationService', 'mainMapService', 'backendService',
        'alertService',
        function($scope, $location, $timeout, leafletData, angularPiwik, mapDefaults,
            playerService, Location, locationService, mainMapService, backendService,
            alertService)
        {
            var player;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapDefaults = mapDefaults;

            /**
             * Locations loaded from the backend indexed by id
             * @type {{}}
             */
            var locations = {};

            // TODO: all this addLocation stuff should be separated to a directive or other controller
            $scope.addLocationStep = 1;

            $scope.nextStep = function() {
                if ($scope.stepIsValid()) {
                    if ($scope.isLastStep()) {
                        $scope.submitNewLocation();
                        angularPiwik.track('map.addLocation', 'finish');
                    }
                    else {
                        $scope.addLocationStep += 1;
                        $scope.addLocationComponent.minimised = false;
                        angularPiwik.track('map.addLocation', 'nextStep', $scope.addLocationStep);
                    }
                }
            };

            $scope.previousStep = function() {
                if ($scope.addLocationStep > 1) {
                    $scope.addLocationStep -= 1;
                    $scope.addLocationComponent.minimised = false;
                    angularPiwik.track('map.addLocation', 'previousStep', $scope.addLocationStep);
                }
            };

            $scope.stepIsValid = function() {
                var loc = locationService.newLocation;
                switch ($scope.addLocationStep) {
                case 1:
                    return (angular.isString(loc.type) && loc.type.length > 0);
                case 2:
                    return (angular.isString(loc.name) && loc.name.length > 0);
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

            // Expose map settings and filters from the service
            $scope.mainMap = mainMapService;
            $scope.activeFilters = locationService.activeFilters;
            $scope.POSSIBLE_FILTERS = locationService.POSSIBLE_FILTERS;

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
             * Whether to show the location products
             * @type {boolean}
             */
            $scope.productShown = false;

            /**
             * Whether to show the location filters
             * @type {boolean}
             */
            $scope.filtersShown = false;

            /**
             * whether to show search
             * @type {boolean}
             */
            $scope.searchShown = false;

            /**
             * Whether the add location form is minimised
             * TODO: should probably go elsewhere
             * @type {{minimised: boolean}}
             */
            $scope.addLocationComponent = {
                minimised: false
            };

            /**
             * Whether the search form is minimised
             * TODO: should probably go elsewhere
             * @type {{minimised: boolean}}
             */
            $scope.searchComponent = {
                minimised: false
            };

            /**
             * Sets whether the product list is shown
             * @param {boolean} [show=true]
             */
            $scope.showProductList = function(show) {
                if (typeof show === 'undefined') {
                    show = true;
                }
                show = !!show;

                // Update and track if it changed
                if ($scope.productShown !== show) {
                    $scope.productShown = show;
                    angularPiwik.track('map.productList', show ? 'open' : 'close');
                }
            };

            /**
             * Sets whether the filters are shown
             * @param {boolean} [show=true]
             */
            $scope.showFilters = function(show) {
                if (typeof show === 'undefined') {
                    show = true;
                }
                show = !!show;

                // Update and track if it changed
                if ($scope.filtersShown !== show) {
                    $scope.filtersShown = show;
                    angularPiwik.track('map.filters', show ? 'open' : 'close');
                }
            };

            /**
             * Sets whether the search is shown
             * @param {boolean} [show=true]
             */
            $scope.showSearch = function(show) {
                if (typeof show === 'undefined') {
                    show = true;
                }
                show = !!show;

                // Update and track if it changed
                if ($scope.searchShown !== show) {
                    $scope.searchShown = show;
                    angularPiwik.track('map.search', show ? 'open' : 'close');
                }
            };

            /**
             * Returns the number of currently active filters
             * @returns {number}
             */
            $scope.numActiveFilters = function() {
                var active = 0;
                if ($scope.activeFilters.recent !== 'anytime') {
                    active += 1;
                }
                if ($scope.activeFilters.type !== 'anytype') {
                    active += 1;
                }

                return active;
            };

            /**
             * Whether the newLocation has already been added to the map
             * @type {boolean}
             */
            var newLocationIsAddedToMap = false;

            /**
             * Whether we are currently placing a location on the map
             * @returns {boolean}
             */
            $scope.isPlacingLocation = function() {
                return (locationService.isAddingLocation() && $scope.addLocationStep === 3);
            };

            /**
             * Starts adding a new location
             */
            $scope.startAddNewLocation = function() {
                $scope.addLocationStep = 1;
                locationService.startAddNewLocation(player);
            };

            /**
             * Aborts adding a new location
             */
            $scope.abortAddNewLocation = function() {
                // Remove from map if it was added
                if (newLocationIsAddedToMap === true) {
                    var markerToRemove = locationService.newLocation.marker;
                    mapPromise.then(function(map) {
                        map.removeLayer(markerToRemove);
                    });
                }
                newLocationIsAddedToMap = false;

                // Tell the location service about it
                locationService.abortAddNewLocation();
            };

            /**
             * Finalises adding a new location
             */
            $scope.submitNewLocation = function() {
                newLocationIsAddedToMap = false;

                // Submit the location and add it to the list once done
                locationService.submitNewLocation()
                    .then(function(newLocation) {
                        locations[newLocation.id] = newLocation;
                        alertService.addAlert('Added new location "' + newLocation.name + '"', 'success');
                    })
                    .catch(function(error) {
                        // TODO: remove the marker from the map
                        alertService.addAlert('Failed to add location: ' + error, 'danger');
                    })
                ;
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
             * @return {boolean} Whether the coordinates where set on the new location
             */
            $scope.setNewLocationCoordinates = function(lat, lng) {
                if (locationService.isAddingLocation()) {
                    // Set the coordinates
                    locationService.newLocation.setLatLng(lat, lng);

                    // Push to map if not already there
                    if (newLocationIsAddedToMap !== true) {
                        mapPromise.then(function(map) {
                            locationService.newLocation.marker.on('click', locationClickHandler);
                            locationService.newLocation.marker.addTo(map);
                        });
                        newLocationIsAddedToMap = true;
                    }

                    // Hide the component
                    $scope.addLocationComponent.minimised = true;

                    // Zoom in all the way to make sure users place it precisely
                    // TODO: duplication with EditLocationCtrl
                    mapPromise.then(function(map) {
                        var maxZoom = map.getMaxZoom();
                        var zoomTo = [lat, lng];
                        if (map.getZoom() < maxZoom || !map.getBounds().contains(zoomTo)) {
                            map.setView(zoomTo, maxZoom);
                        }
                    });

                    return true;
                }
                return false;
            };

            /**
             * Handler for clicks on the map
             * @param event
             * @param args
             */
            var mapClickHandler = function(event, args) {
                if (locationService.isAddingLocation()) {
                    if ($scope.addLocationStep === 3) {
                        // When adding a new location, take the click
                        // as the coordinates of this new location
                        $scope.setNewLocationCoordinates(
                            args.leafletEvent.latlng.lat,
                            args.leafletEvent.latlng.lng
                        );

                        angularPiwik.track('map.addLocation', 'mapClick');
                    }
                    // TODO: else what? We are adding a location but clicked one -> should show some info of the clicked place
                }
                else {
                    // When not adding a location, deselect currently active location
                    locationService.activate();

                    // And hide product list, filters and search
                    $scope.showProductList(false);
                    $scope.showFilters(false);
                    $scope.showSearch(false);
                }
            };

            /**
             * Handler for clicks on map markers (Locations)
             * @param event Event coming directly from leaflet
             *      (not angular-leaflet-directive)
             */
            var locationClickHandler = function(event) {
                if (!locationService.isAddingLocation()) {
                    var clickedLocation = locations[event.target.locationId];
                    if (clickedLocation && !clickedLocation.isDisabled()) {
                        // Run it through $apply since we are coming directly from Leaflet
                        $scope.$apply(function() {
                            locationService.activate(clickedLocation);

                            // Hide the product list, filters and search
                            $scope.showProductList(false);
                            $scope.showFilters(false);
                            $scope.showSearch(false);
                        });
                    }
                }
                // TODO: if not handled, should pass on the click to the map
            };

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();

            // Register event handlers
            $scope.$on('leafletDirectiveMap.click', mapClickHandler);

            /**
             * Load the locations that are within the current bounding box
             */
            var loadLocations = function() {
                mapPromise.then(function(map) {
                    // Get the bounds of the map
                    var bounds = map.getBounds().toBBoxString();

                    // TODO: make the loading of locations smarter: e.g. when zooming in, don't reload at all
                    locationService.getLocations(bounds).then(function(loadedLocations) {
                        // Remove old markers
                        angular.forEach(locations, function(location) {
                            map.removeLayer(location.marker);
                        });

                        // Set new locations
                        locations = loadedLocations;

                        // Go through all the locations and add the marker to the map
                        angular.forEach(locations, function(location) {
                            location.marker.on('click', locationClickHandler);
                            location.marker.addTo(map);
                        });

                        // Apply the current filter value
                        applyFilters($scope.activeFilters);
                    });
                });
            };

            // Check if we are logged in
            if (backendService.isLoggedIn()) {
                // Get the player
                playerService.getDeferredMe().then(function(me) {
                    player = me;
                });
            }

            // Watch the map center for changes to save it
            $scope.$watch('mainMap.center', function() {
                mainMapService.saveCenter();

                // Reload locations
                loadLocations();
            });


            // TODO: move the filter stuff to a separate controller
            /**
             * Map of recent filter values to the period of
             * time for which to show the locations.
             * @type {{month: number, week: number, day: number}}
             */
            var RECENT_FILTER_PERIOD = {
                month: 4 * 7 * 24 * 3600000,
                week: 7 * 24 * 3600000,
                day: 24 * 3600000
            };

            /**
             * Runs the locations through the given recent filter
             * @param recentFilter
             */
            var _applyRecentFilter = function(recentFilter) {
                var showAll = (recentFilter === 'anytime');
                var recentDate;
                if (!showAll) {
                    recentDate = new Date(Date.now() - RECENT_FILTER_PERIOD[recentFilter]);
                }

                // Go through all the locations and filter them
                angular.forEach(locations, function(location) {
                    // Only apply the filter if the location is not already hidden
                    if (!location.isDisabled()) {
                        var disableIt = (!showAll && location.updatedAt < recentDate);
                        location.setDisabled(disableIt);
                    }
                });
            };

            /**
             * Runs the locations through the given type filter
             * @param typeFilter
             */
            var _applyTypeFilter = function(typeFilter) {
                var showAll = (typeFilter === 'anytype');
                // Go through all the locations and filter them
                angular.forEach(locations, function(location) {
                    // Only apply the filter if the location is not already hidden
                    if (!location.isDisabled()) {
                        var disableIt = (!showAll && location.type !== typeFilter);
                        location.setDisabled(disableIt);
                    }
                });
            };

            /**
             * Runs the locations through all the filters
             * Add new filters to this function
             * @param typeFilter
             */
            var applyFilters = function(filters, filtersBefore) {
                // First show all the locations
                // TODO: this is inefficient because the marker might update twice (show it, then hide it again)
                angular.forEach(locations, function(location) {
                    location.setDisabled(false);
                });

                // Track filter usage
                if (angular.isDefined(filtersBefore)) {
                    if (filters.recent !== filtersBefore.recent) {
                        angularPiwik.track('map.filters', 'applyFilter.recent', filters.recent);
                    }
                    if (filters.type !== filtersBefore.type) {
                        angularPiwik.track('map.filters', 'applyFilter.type', filters.type);
                    }
                }

                // Then run the filters
                _applyRecentFilter(filters.recent);
                _applyTypeFilter(filters.type);
            };

            // Watch the active filters
            $scope.$watch('activeFilters', applyFilters, true);

            // Listen to location changes to update the map center
            // (if the user changes the hash manually)
            $scope.$onRootScope('$locationChangeSuccess', function() {
                mainMapService.setMapCenterFromUrl();
            });

            // When we go away from this page, reset the url and abort adding location
            $scope.$onRootScope('$routeChangeStart', function(event) {
                if (!event.defaultPrevented) {
                    // Remove the hash if the event is still ongoing
                    $location.hash(null);

                    // Abort adding a new location
                    locationService.abortAddNewLocation();
                }
            });
        }
    ]);
})(window.veganaut.mapModule);
