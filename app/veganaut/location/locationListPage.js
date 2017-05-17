(function() {
    'use strict';

    /**
     * This components shows a list of locations. Which locations to show is
     * determined based on coordinates and a radius that are read from GET parameters.
     * @type {{}}
     */
    var locationListPageComponent = {
        controller: 'vgLocationListPageCtrl',
        templateUrl: '/veganaut/location/locationListPage.tpl.html'
    };

    var locationListPageCtrl = [
        '$scope', '$location', '$routeParams', 'constants', 'locationService',
        'angularPiwik', 'geocodeService', 'areaService', 'Area', 'locationFilterService',
        function($scope, $location, $routeParams, constants, locationService,
            angularPiwik, geocodeService, areaService, Area, locationFilterService)
        {
            var $ctrl = this;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            $ctrl.legacyGlobals = {
                goToView: $scope.$parent.goToView
            };

            /**
             * How many locations to show by default and then show more
             * when the "Show more" button is clicked.
             * @type {number}
             */
            var NUM_LOCATIONS_SHOWN_STEP = 20;

            /**
             * Sorted list of locations to show
             * @type {Array}
             */
            $ctrl.list = [];

            /**
             * Total number of locations found
             * @type {number}
             */
            $ctrl.totalLocations = 0;

            /**
             * Whether no results were found (either because of invalid query parameters
             * or because no locations are found in the given area).
             * If not false, it's the translation key that should be used to show the
             * no results message (depends on the filters as well).
             * @type {boolean|string}
             */
            $ctrl.noResultsText = false;

            /**
             * Whether the whole world is shown.
             * @type {boolean}
             */
            $ctrl.wholeWorld = false;

            /**
             * Radius of this query formatted for display
             * @type {string}
             */
            $ctrl.displayRadius = '';

            /**
             * Name of the approximate place that we are showing locations around
             * @type {string}
             */
            $ctrl.displayName = '';

            /**
             * Whether to show the 'city' or the 'street' part of the address.
             * Depends on the radius shown.
             * @type {string}
             */
            $ctrl.addressType = undefined;

            /**
             * Handler for toggling the open state of a location in the list
             * @param {Location} location
             */
            $ctrl.onOpenToggle = function(location) {
                locationService.loadFullLocation(location);
            };

            /**
             * Shows the next batch of locations
             */
            $ctrl.showMore = function() {
                locationService.getLocationsByRadius(
                    lastParams.lat, lastParams.lng, lastParams.radius,
                    NUM_LOCATIONS_SHOWN_STEP, $ctrl.list.length,
                    $ctrl.addressType
                ).then(function(data) {
                    $ctrl.totalLocations = data.totalLocations;
                    $ctrl.list = $ctrl.list.concat(data.locations);
                });

                // Track it
                angularPiwik.track('locationList', 'locationList.showMore');
            };

            /**
             * Last parameters that were used to query the locations
             * @type {{}}
             */
            var lastParams = {};

            /**
             * Resets the list to empty.
             * Note: this doesn't reset the area of the list.
             */
            var resetList = function() {
                // Reset list and related variables
                $ctrl.list = [];
                $ctrl.totalLocations = 0;
                $ctrl.noResultsText = false;
            };

            /**
             * Sorts and filters the locations and stores them in $ctrl.list
             */
            var compileList = function(data) {
                // Make sure the list is reset
                resetList();

                $ctrl.totalLocations = data.totalLocations;
                $ctrl.list = data.locations;

                // Check if we found any results
                if ($ctrl.list.length === 0) {
                    if (locationFilterService.hasActiveFilters()) {
                        $ctrl.noResultsText = 'locationList.noResultsFiltered';
                    }
                    else {
                        $ctrl.noResultsText = 'locationList.noResults';
                    }
                }
            };

            /**
             * Loads the locations with the currently set lastParams
             */
            var loadLocations = function() {
                // Note: we don't reset the list here, as it's nicer when the list stays
                // rendered when filters are applied.
                locationService.getLocationsByRadius(
                    lastParams.lat, lastParams.lng, lastParams.radius,
                    NUM_LOCATIONS_SHOWN_STEP, 0,
                    $ctrl.addressType
                )
                    .then(compileList)
                ;
            };

            // TODO: this should go in a service, so state can be kept better also when return to a list one has already interacted with
            /**
             * Shows the list of the given area
             * @param {Area} area
             */
            var showArea = function(area) {
                // Get the radius params from the area
                lastParams = area.getRadiusParams();

                // Expose if we are showing the whole world
                $ctrl.wholeWorld = lastParams.includesWholeWorld;

                // Reset the area display variables and the list itself
                resetList();
                $ctrl.displayRadius = '';
                $ctrl.displayName = '';

                // Check whether to show the city or street part of the address
                $ctrl.addressType = (lastParams.radius > constants.ADDRESS_TYPE_BOUNDARY_RADIUS ? 'city' : 'street');

                // Load locations with the newly set params
                loadLocations();

                // Replace the url params (without adding a new history item)
                // TODO: de-duplicate this code with the one from mainMapService
                var coords =
                    lastParams.lat.toFixed(constants.URL_FLOAT_PRECISION) + ',' +
                    lastParams.lng.toFixed(constants.URL_FLOAT_PRECISION);
                $location.replace();
                $location.search('coords', coords);
                $location.search('radius', lastParams.radius);

                if (!$ctrl.wholeWorld) {
                    // Simple fallback display name in case the reverse lookup doesn't work out.
                    // TODO: should be translated and displayed nicer
                    var fallbackDisplayName = 'lat ' + lastParams.lat.toFixed(3) + ' lng ' + lastParams.lng.toFixed(3);

                    // Reverse lookup a place name for these coordinates
                    // Choose a zoom level based on the radius
                    var reverseLookupZoom = (lastParams.radius < 2000) ? 16 : 13;
                    geocodeService.reverseSearch(lastParams.lat, lastParams.lng, reverseLookupZoom)
                        .then(function(place) {
                            if (place) {
                                $ctrl.displayName = place.getDisplayName();
                            }
                            else {
                                $ctrl.displayName = fallbackDisplayName;
                            }
                        })
                        .catch(function() {
                            $ctrl.displayName = fallbackDisplayName;
                        })
                    ;

                    // Round the radius to two significant digits and display it as meters or kms
                    // TODO: this should be a filter
                    var roundingHelper = Math.pow(10, ('' + lastParams.radius).length) / 100;
                    var roundedRadius = Math.round(lastParams.radius / roundingHelper) * roundingHelper;
                    if (roundedRadius < 1000) {
                        $ctrl.displayRadius = roundedRadius + 'm';
                    }
                    else {
                        $ctrl.displayRadius = (roundedRadius / 1000) + 'km';
                    }
                }
            };

            // Parse params from url
            // TODO: de-duplicate with code from mainMapService
            var rawCoords = $routeParams.coords || '';
            var lat, lng;

            // Parse the coordinates
            var splitCoords = rawCoords.split(',');
            if (splitCoords.length === 2) {
                lat = parseFloat(splitCoords[0]);
                lng = parseFloat(splitCoords[1]);

                // Try to set it (will check if it's valid)
                areaService.setArea(new Area({
                    lat: lat,
                    lng: lng,
                    radius: parseInt($routeParams.radius, 10)
                }));
            }

            // Set the filters from the URL and initiate with the currently valid area
            locationFilterService.setFiltersFromUrl();
            areaService.getCurrentArea().then(showArea);

            // Listen to explicit area changes
            $scope.$on('veganaut.area.changed', function() {
                areaService.getCurrentArea().then(showArea);
            });

            // Reload locations when filters change
            $scope.$on('veganaut.filters.changed', loadLocations);

            // Reset search parameters when navigating away from this page
            $scope.$on('$routeChangeStart', function(event) {
                if (!event.defaultPrevented) {
                    // Remove the search params if the event is still ongoing
                    $location.search('coords', undefined);
                    $location.search('radius', undefined);
                }
            });
        }
    ];

    // Expose as component
    angular.module('veganaut.app.location')
        .controller('vgLocationListPageCtrl', locationListPageCtrl)
        .component('vgLocationListPage', locationListPageComponent)
    ;
})();
