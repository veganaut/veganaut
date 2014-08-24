(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'tileLayerUrl', 'locationService', 'visitService',
        function($scope, $routeParams, tileLayerUrl, locationService, visitService) {
            var locationId = $routeParams.id;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapSettings = {
                tileLayer: tileLayerUrl
            };

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
            };

            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        $scope.center.lat = $scope.location.lat;
                        $scope.center.lng = $scope.location.lng;

                        $scope.visit = visitService.getVisit($scope.location);
                        break;
                    }
                }
            });
        }
    ]);
})(window.veganaut.mapModule);
