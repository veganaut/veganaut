(function() {
    'use strict';

    /**
     * This components shows a list of locations. Which locations to show is
     * determined based on coordinates and a radius that are read from GET parameters.
     * @returns {directive}
     */
    var locationListDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgLocationListCtrl',
            controllerAs: 'locationListVm',
            bindToController: true,
            templateUrl: '/veganaut/location/locationList.tpl.html'
        };
    };

    var locationListCtrl = [
        '$scope', '$location', '$routeParams', 'constants', 'locationService',
        'locationFilterService', 'angularPiwik', 'geocodeService', 'areaService', 'Area',
        function($scope, $location, $routeParams, constants, locationService,
            locationFilterService, angularPiwik, geocodeService, areaService, Area)
        {
            var vm = this;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            vm.legacyGlobals = {
                goToView: $scope.$parent.goToView,
                isEmbedded: $scope.$parent.isEmbedded
            };

            // Expose map settings and filter service
            vm.locationFilterService = locationFilterService;


            // Get the location set that we'll display
            var locationSet = locationService.getLocationSet();

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
            vm.list = [];

            /**
             * Whether no results were found (either because of invalid query parameters
             * or because no locations are found in the given area)
             * @type {boolean}
             */
            vm.noResults = false;

            /**
             * Whether the whole world is shown.
             * @type {boolean}
             */
            vm.wholeWorld = false;

            /**
             * Whether to show the location filters
             * @type {boolean}
             */
            vm.filtersShown = false;

            /**
             * Radius of this query formatted for display
             * @type {string}
             */
            vm.displayRadius = '';

            /**
             * Name of the approximate place that we are showing locations around
             * @type {string}
             */
            vm.displayName = '';

            /**
             * Number of currently shown locations
             * @type {number}
             */
            vm.numShownLocations = 0;

            /**
             * Handler for toggling the open state of a location in the list
             * @param {Location} location
             */
            vm.onOpenToggle = function(location) {
                // Activate the location (this will load the full location data)
                // If it's already activated, this will de-activate it
                locationSet.activate(location);
            };

            /**
             * Shows the next batch of locations
             */
            vm.showMore = function() {
                // Increase by the step size, but don't go bigger than the max available
                vm.numShownLocations = Math.min(
                    vm.list.length,
                    vm.numShownLocations + NUM_LOCATIONS_SHOWN_STEP
                );

                // Track it
                angularPiwik.track('locationList', 'locationList.showMore');
            };

            /**
             * Sets whether the filters are shown
             * @param {boolean} [show=true]
             */
            vm.showFilters = function(show) {
                if (typeof show === 'undefined') {
                    show = true;
                }
                show = !!show;

                // Update and track if it changed
                if (vm.filtersShown !== show) {
                    vm.filtersShown = show;
                    angularPiwik.track('list.filters', show ? 'open' : 'close');
                }
            };

            // Watch the active filters
            $scope.$watchCollection('locationListVm.locationFilterService.activeFilters',
                function(filters, filtersBefore) {
                    // Track filter usage
                    if (angular.isDefined(filtersBefore)) {
                        // Note: this also tracks when the filter is changed through the url
                        if (filters.recent !== filtersBefore.recent) {
                            angularPiwik.track('list.filters', 'applyFilter.recent', filters.recent);
                        }
                        if (filters.type !== filtersBefore.type) {
                            angularPiwik.track('list.filters', 'applyFilter.type', filters.type);
                        }
                }
                    areaService.getCurrentArea().then(init);
            }
            );


            /**
             * Sorts and filters the locations and stores them in vm.list
             * @param {LocationSet} locationSet
             */
            var compileList = function() {
                vm.list = _.chain(locationSet.locations)
                    // TODO: enable filtering
                    //.filter(function(loc) {
                    //    return !loc.isDisabled();
                    //})
                    .sortByOrder(['quality.average', 'quality.numRatings', 'name'], ['desc', 'desc', 'asc'])
                    // TODO: should sort by rank, but don't have the rank in the frontend
                    .value()
                ;

                // Check if we found any results
                if (vm.list.length === 0) {
                    vm.noResults = true;
                }
                else {
                    // Show the first batch of locations
                    vm.numShownLocations = Math.min(
                        vm.list.length,
                        NUM_LOCATIONS_SHOWN_STEP
                    );
                }
            };


            var init = function(area) {
                // Get the radius params from the area
                var params = area.getRadiusParams();

                // Expose if we are showing the whole world
                vm.wholeWorld = params.includesWholeWorld;

                // Query
                locationService.queryByRadius(params.lat, params.lng, params.radius)
                    .then(compileList)
                ;

                // Replace the url params (without adding a new history item)
                // TODO: de-duplicate this code with the one from mainMapService
                var coords =
                    params.lat.toFixed(constants.URL_FLOAT_PRECISION) + ',' +
                    params.lng.toFixed(constants.URL_FLOAT_PRECISION);
                $location.replace();
                $location.search('coords', coords);
                $location.search('radius', params.radius);

                if (!vm.wholeWorld) {
                    // Simple fallback display name in case the reverse lookup doesn't work out.
                    // TODO: should be translated and displayed nicer
                    var fallbackDisplayName = 'lat ' + params.lat.toFixed(3) + ' lng ' + params.lng.toFixed(3);

                    // Reverse lookup a place name for these coordinates
                    // Choose a zoom level based on the radius
                    var reverseLookupZoom = (params.radius < 2000) ? 16 : 13;
                    geocodeService.reverseSearch(params.lat, params.lng, reverseLookupZoom)
                        .then(function(place) {
                            if (place) {
                                vm.displayName = place.getDisplayName();
                            }
                            else {
                                vm.displayName = fallbackDisplayName;
                            }
                        })
                        .catch(function() {
                            vm.displayName = fallbackDisplayName;
                        })
                    ;

                    // Round the radius to two significant digits and display it as meters or kms
                    // TODO: this should be a filter
                    var roundingHelper = Math.pow(10, ('' + params.radius).length) / 100;
                    var roundedRadius = Math.round(params.radius / roundingHelper) * roundingHelper;
                    if (roundedRadius < 1000) {
                        vm.displayRadius = roundedRadius + 'm';
                    }
                    else {
                        vm.displayRadius = (roundedRadius / 1000) + 'km';
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

            // Initiate with the currently valid area
            areaService.getCurrentArea().then(init);

            // Reset search parameters when navigating away from this page
            $scope.$on('$routeChangeStart', function(event) {
                if (!event.defaultPrevented) {
                    // Remove the search params if the event is still ongoing
                    $location.search('coords', null);
                    $location.search('radius', null);
                }
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.location')
        .controller('vgLocationListCtrl', locationListCtrl)
        .directive('vgLocationList', [locationListDirective])
    ;
})();
