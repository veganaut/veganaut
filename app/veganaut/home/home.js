(function() {
    'use strict';

    /**
     * Component for the home page.
     * @returns {directive}
     */
    var homeDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgHomeCtrl',
            controllerAs: 'homeVm',
            bindToController: true,
            templateUrl: '/veganaut/home/home.tpl.html'
        };
    };

    var homeCtrl = [
        '$scope', 'leafletData', 'mapDefaults', 'locationService', 'mainMapService',
        function($scope, leafletData, mapDefaults, locationService, mainMapService) {
            var vm = this;
            // TODO: this is mostly mostly duplications with mainMap -> consolidate!

            // Expose the global methods we still need
            // TODO: find a better way to do this
            vm.legacyGlobals = {
                goToView: $scope.$parent.goToView,
                isLoggedIn: $scope.$parent.isLoggedIn
            };

            /**
             * Leaflet map settings
             * @type {{}}
             */
            vm.mapDefaults = mapDefaults;

            /**
             * Reference to the leaflet map object
             * @type {{}}
             */
            vm.map = undefined;

            /**
             * Locations loaded from the backend
             * @type {LocationSet}
             */
            vm.locationSet = locationService.getLocationSet();

            // Expose map settings and filter service
            vm.mapCenter = mainMapService.center;

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();
            mapPromise.then(function(map) {
                // Expose the map
                vm.map = map;

                // Query the locations
                locationService.queryByBounds(map.getBounds().toBBoxString());
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.home')
        .controller('vgHomeCtrl', homeCtrl)
        .directive('vgHome', [homeDirective])
    ;
})();
