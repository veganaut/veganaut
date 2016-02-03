(function() {
    'use strict';

    /**
     * Renders a list of geocode search results.
     * A handler is notified when the user clicks on one of the results.
     * @returns {directive}
     */
    var geocodeSearchResultsDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Array of GeocodeResults to display.
                 */
                results: '=vgResults',

                /**
                 * Optional handler called when the user selects a result.
                 */
                onSelect: '&?vgOnSelect',

                /**
                 * Optional reference to a Leaflet map object.
                 * If given, moves and zooms the map to the result the user
                 * selects.
                 */
                map: '=?vgMap'
            },
            controller: 'vgGeocodeSearchResultsCtrl',
            controllerAs: 'geocodeSearchResultsVm',
            bindToController: true,
            templateUrl: '/veganaut/search/geocodeSearchResults.tpl.html'
        };
    };

    var geocodeSearchResultsCtrl = [
        function() {
            var vm = this;

            /**
             * Handles selection of search results by the user
             * @param {GeocodeResult} result
             */
            vm.selectResult = function(result) {
                // Fit to bound if we have a map and valid bounds
                if (angular.isObject(vm.map) && angular.isArray(result.bounds)) {
                    vm.map.fitBounds(result.bounds);
                }

                // Call handler if there is one
                if (angular.isFunction(vm.onSelect)) {
                    vm.onSelect({result: result});
                }
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.search')
        .controller('vgGeocodeSearchResultsCtrl', geocodeSearchResultsCtrl)
        .directive('vgGeocodeSearchResults', [geocodeSearchResultsDirective])
    ;
})();
