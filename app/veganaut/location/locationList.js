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
        '$scope', '$location', 'locationService', 'angularPiwik', 'geocodeService',
        function($scope, $location, locationService, angularPiwik, geocodeService) {
            var vm = this;

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
                locationService.activate(location);
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
             * Navigates to the map
             * TODO: this method should not be necessary in this controller
             */
            vm.goToMap = function() {
                $location.path('map');
            };

            /**
             * Sorts and filters the locations and stores them in vm.list
             * @param {Location[]} locations
             */
            var compileList = function(locations) {
                vm.list = _.chain(locations)
                    .filter(function(loc) {
                        return !loc.isDisabled();
                    })
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

            // Parse query
            // TODO: the whole parsing should happen in its own function or so
            var query = $location.search();
            var lat = parseFloat(query.lat);
            var lng = parseFloat(query.lng);
            var radius = parseInt(query.radius, 10);

            // Check if valid
            if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
                // Valid, get the locations
                locationService.getLocationsByRadius(lat, lng, radius).then(compileList);

                // Simple fallback display name in case the reverse lookup doesn't work out.
                // TODO: should be translated and displayed nicer
                var fallbackDisplayName = 'lat ' + lat.toFixed(3) + ' lng ' + lng.toFixed(3);

                // Reverse lookup a place name for these coordinates
                // Choose a zoom level based on the radius
                var reverseLookupZoom = (radius < 2000) ? 16 : 13;
                geocodeService.reverseSearch(lat, lng, reverseLookupZoom)
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
                var roundingHelper = Math.pow(10, ('' + radius).length) / 100;
                var roundedRadius = Math.round(radius / roundingHelper) * roundingHelper;
                if (roundedRadius < 1000) {
                    vm.displayRadius = roundedRadius + 'm';
                }
                else {
                    vm.displayRadius = (roundedRadius / 1000) + 'km';
                }
            }
            else {
                // Not valid -> no results found
                vm.noResults = true;
            }

            // Reset search parameters when navigating away from this page
            // TODO: should probably not use $onRootScope
            $scope.$onRootScope('$routeChangeStart', function(event) {
                if (!event.defaultPrevented) {
                    $location
                        .search('lat', null)
                        .search('lng', null)
                        .search('radius', null)
                    ;
                }
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.location')
        .controller('vgLocationListCtrl', locationListCtrl)
        .directive('vgLocationList', [locationListDirective])
    ;
})(window.veganaut.locationModule);
