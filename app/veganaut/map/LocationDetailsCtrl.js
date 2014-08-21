(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'tileLayerUrl', 'locationService', 'missionService',
        function($scope, $routeParams, tileLayerUrl, locationService, missionService) {
            var locationId = parseInt($routeParams.id);

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

            $scope.missionSet = undefined;
            $scope.location = undefined;

            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        $scope.center.lat = $scope.location.lat;
                        $scope.center.lng = $scope.location.lng;

                        $scope.missionSet = missionService.getMissionSet($scope.location);
                        break;
                    }
                }
            });
        }
    ]);
})(window.veganaut.mapModule);
