(function() {
    'use strict';

    /**
     * TODO
     * @returns {directive}
     */
    var locationListDirective = function() {
        return {
            restrict: 'E',
            scope: {
                _locations: '=vgLocations'
            },
            controller: [
                '$scope', '$location', 'locationService',
                function($scope, $location, locationService) {
                    var vm = this;

                    /**
                     * Sorted list of locations to show
                     * @type {Array}
                     */
                    vm.list = [];

                    /**
                     * Whether we have a valid query (center and radius)
                     * @type {boolean}
                     */
                    vm.validQuery = false;

                    /**
                     * Radius of this query formatted for display
                     * @type {string}
                     */
                    vm.displayRadius = '';

                    /**
                     * Handler for toggling the open state of a location in the list
                     * @param {Location} location
                     * @param {boolean} isOpen
                     */
                    vm.onOpenToggle = function(location, isOpen) {
                        if (isOpen) {
                            // Activate the location (this will load the full location data)
                            locationService.activate(location);
                        }
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
                    };

                    // Watch the locations to re-compile the list on changes
                    $scope.$watchCollection('locationListVm._locations', compileList);

                    // Parse query
                    // TODO: the whole parsing should happen in its own function or so
                    var query = $location.search();
                    var lat = parseFloat(query.lat);
                    var lng = parseFloat(query.lng);
                    var radius = parseInt(query.radius, 10);

                    // Check if valid
                    if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
                        vm.validQuery = true;

                        // Valid, get the locations
                        locationService.getLocationsByRadius(lat, lng, radius).then(compileList);
                    }

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
            ],
            controllerAs: 'locationListVm',
            bindToController: true,
            templateUrl: '/veganaut/location/locationList.tpl.html'
        };
    };

    // Expose as directive
    angular.module('veganaut.app.location')
        .directive('vgLocationList', [locationListDirective])
    ;
})(window.veganaut.locationModule);
