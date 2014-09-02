(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl',
        ['$scope', '$routeParams', '$location', 'mapDefaults', 'locationService', 'visitService', 'playerService',
        function($scope, $routeParams, $location, mapDefaults, locationService, visitService, playerService) {
            var locationId = $routeParams.id;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapDefaults = mapDefaults;

            /**
             * Current center of the map
             * @type {{lat: number, lng: number, zoom: number}}
             */
            $scope.center = {
                lat: 0,
                lng: 0,
                zoom: 16
            };

            $scope.visit = undefined;
            $scope.location = undefined;

            $scope.submitVisit = function() {
                visitService.submitVisit($scope.visit);
                $location.path('map');
            };

            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        $scope.center.lat = $scope.location.lat;
                        $scope.center.lng = $scope.location.lng;
                        break;
                    }
                }
                // TODO: handle location not found
                // TODO: should do this in parallel with getLocations
                playerService.getMe().then(function(me) {
                    $scope.visit = visitService.getVisit($scope.location, me);
                });
            });
        }
    ]);
})(window.veganaut.mapModule);
