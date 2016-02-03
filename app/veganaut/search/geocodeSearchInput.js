(function() {
    'use strict';

    /**
     * Search input field for a geocode search.
     * Results are set on the vg-results-model binding.
     * @returns {directive}
     */
    var geocodeSearchInputDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Array of GeocodeResults for the search term the user entered.
                 */
                results: '=vgResultsModel',

                /**
                 * Label to show for the input field.
                 */
                label: '@vgLabel',

                /**
                 * Placeholder for the input field.
                 */
                placeholder: '@vgPlaceholder',

                /**
                 * Id to use for the input field.
                 * TODO: is this really necessary?
                 */
                inputId: '@vgInputId'
            },
            controller: 'vgGeocodeSearchInputCtrl',
            controllerAs: 'geocodeSearchInputVm',
            bindToController: true,
            templateUrl: '/veganaut/search/geocodeSearchInput.tpl.html'
        };
    };

    /**
     * Minimum number of characters to start the search for.
     * @type {number}
     */
    var MIN_SEARCH_LENGTH = 4;

    var geocodeSearchInputCtrl = [
        '$scope', 'geocodeService',
        function($scope, geocodeService) {
            var vm = this;

            /**
             * Models used for the search input field
             * @type {string}
             */
            vm.input = '';

            // Watch the geocoding search string
            $scope.$watch('geocodeSearchInputVm.input', function() {
                // Reset results
                vm.results = [];

                // Only start new query if the string is long enough
                if (!angular.isString(vm.input) || vm.input.length < MIN_SEARCH_LENGTH) {
                    return;
                }

                // Lookup the search string
                geocodeService.search(vm.input)
                    .then(function(data) {
                        vm.results = data;
                    })
                ;
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.search')
        .controller('vgGeocodeSearchInputCtrl', geocodeSearchInputCtrl)
        .directive('vgGeocodeSearchInput', [geocodeSearchInputDirective])
    ;
})();
