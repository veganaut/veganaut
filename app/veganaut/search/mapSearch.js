(function() {
    'use strict';

    /**
     * Component for map search input and results.
     * @returns {directive}
     */
    var mapSearchDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Leaflet map object on which the search results should be shown
                 * (zooms to the selected search result).
                 */
                map: '=vgMap',

                /**
                 * Handler for when the user closes the search component.
                 */
                onClose: '&vgOnClose'
            },
            controller: 'vgMapSearchCtrl',
            controllerAs: 'mapSearchVm',
            bindToController: true,
            templateUrl: '/veganaut/search/mapSearch.tpl.html'
        };
    };

    var mapSearchCtrl = [
        'angularPiwik',
        function (angularPiwik) {
            var vm = this;

            /**
             * Whether the search component is minimised
             * @type {boolean}
             */
            vm.minimised = false;

            /**
             * Handles result selection: minimise and track.
             * Showing the result location on the map is done by
             * vgGeocodeSearchResults
             */
            vm.onResultSelect = function() {
                vm.minimised = true;
                angularPiwik.track('map.search', 'selectResult');
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.search')
        .controller('vgMapSearchCtrl', mapSearchCtrl)
        .directive('vgMapSearch', [mapSearchDirective])
    ;
})();
