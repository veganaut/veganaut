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
                 * Optional handler called when the user selects a search result.
                 */
                onSelect: '&?vgOnSelect'
            },
            controller: 'vgGlobalSearchCtrl',
            controllerAs: 'globalSearchVm',
            bindToController: true,
            templateUrl: '/veganaut/search/globalSearch.tpl.html'
        };
    };

    var globalSearchCtrl = [
        '$scope', '$q', '$location', 'geocodeService', 'searchService', 'locationService', 'areaService', 'Area',
        function($scope, $q, $location, geocodeService, searchService, locationService, areaService, Area) {
            var vm = this;

            // Expose the search service
            vm.searchService = searchService;

            // TODO WIP: track all the stuff here!

            /**
             * Handles clicks on a location result
             * @param {Location} location
             */
            vm.onLocationClick = function(location) {
                // Go to the location detail page
                $location.path('location/' + location.id);

                // Tell parent user selected a result
                vm.notifyParent();
            };

            /**
             * Handles clicks on the geo results
             * @param {GeocodeResult} geoResult
             */
            vm.onGeoClick = function(geoResult) {
                // TODO WIP: GeocodeResult should provide an area directly
                var geoArea = new Area({
                    lat: geoResult.lat,
                    lng: geoResult.lng,
                    boundingBox: geoResult.bounds,
                    name: geoResult.getDisplayName()
                });

                // Show the are on the currently selected page type
                areaService.showAreaOn(geoArea, vm.searchService.geoAction);

                // Tell parent user selected a result
                vm.notifyParent();
            };

            // TODO WIP: how to update search URL to contain query string?
            vm.onShowMoreLocations = function() {
                $location.path('/search');
                vm.notifyParent();
            };

            vm.onShowMoreGeo = function() {
                $location.path('/search');
                vm.notifyParent();
            };

            /**
             * Informs the parent that a result was selected
             * (if a handler was defined).
             */
            vm.notifyParent = function() {
                if (angular.isFunction(vm.onSelect)) {
                    vm.onSelect();
                }
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.search')
        .controller('vgGlobalSearchCtrl', globalSearchCtrl)
        .directive('vgGlobalSearch', [globalSearchDirective])
    ;
})();
