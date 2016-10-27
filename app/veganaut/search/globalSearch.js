(function() {
    'use strict';

    /**
     * Directive for the global search (across all types of data).
     * Render the form as well as the results.
     * @returns {directive}
     */
    var globalSearchDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Optional handler called when the user selects a result.
                 */
                onSelect: '&?vgOnSelect'
            },
            controller: 'vgGlobalSearchCtrl',
            controllerAs: 'globalSearchVm',
            bindToController: true,
            templateUrl: '/veganaut/search/globalSearch.tpl.html'
        };
    };

    /**
     * Minimum characters required to start searching
     * @type {number}
     */
    var MIN_SEARCH_LENGTH = 1;

    var globalSearchCtrl = [
        '$scope', '$location', 'geocodeService', 'searchService', 'locationService', 'areaService', 'Area',
        function($scope, $location, geocodeService, searchService, locationService, areaService, Area) {
            var vm = this;

            // Expose the search service
            vm.searchService = searchService;

            /**
             * Whether to show the results
             * @returns {boolean}
             */
            vm.shouldShowResults = function() {
                // True if any results are available
                return (vm.searchService.geocodeResults.length > 0 || vm.searchService.locationResults.length > 0);
            };

            /**
             * Whether the search form can be submitted
             * @returns {boolean}
             */
            vm.canSubmit = function() {
                return (angular.isString(vm.searchService.searchString) &&
                vm.searchService.searchString.length >= MIN_SEARCH_LENGTH);
            };

            // TODO WIP: watch and submit after a while of inaction if not already done
            /**
             * Handler for submitting the search
             */
            vm.onSubmit = function() {
                if (!vm.canSubmit()) {
                    return;
                }

                // Reset results
                vm.searchService.geocodeResults = [];
                vm.searchService.locationResults = [];

                // Lookup the search string
                geocodeService.search(vm.searchService.searchString, 2)
                    .then(function(data) {
                        vm.searchService.geocodeResults = data;
                    })
                ;

                locationService.searchLocations(vm.searchService.searchString, 2)
                    .then(function(locations) {
                        vm.searchService.locationResults = locations;
                    })
                ;
            };

            // TODO WIP: track all the stuff here!

            /**
             * Handles clicks on a location result
             * @param {Location} location
             */
            vm.onLocationClick = function(location) {
                $location.path('location/' + location.id);

                // TODO WIP: how to do this better?
                vm.onSelect();
            };

            /**
             * Handles clicks on the map link of geo results
             * @param {GeocodeResult} geoResult
             */
            vm.onGeoMapClick = function(geoResult) {
                // TODO WIP: GeocodeResult should provide an area directly
                var geoArea = new Area({
                    lat: geoResult.lat,
                    lng: geoResult.lng,
                    boundingBox: geoResult.bounds,
                    name: geoResult.getDisplayName()
                });

                areaService.showAreaOnMap(geoArea);

                // TODO WIP: how to do this better?
                vm.onSelect();
            };

            /**
             * Handles clicks on the list link of geo results
             * @param {GeocodeResult} geoResult
             */
            vm.onGeoListClick = function(geoResult) {
                // TODO WIP: GeocodeResult should provide an area directly
                var geoArea = new Area({
                    lat: geoResult.lat,
                    lng: geoResult.lng,
                    boundingBox: geoResult.bounds,
                    name: geoResult.getDisplayName()
                });

                areaService.showAreaOnList(geoArea);

                // TODO WIP: how to do this better?
                vm.onSelect();
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.search')
        .controller('vgGlobalSearchCtrl', globalSearchCtrl)
        .directive('vgGlobalSearch', [globalSearchDirective])
    ;
})();
