(function(controllersModule) {
    'use strict';

    controllersModule.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'tileLayerUrl', 'locationService',
        function($scope, $routeParams, tileLayerUrl, locationService) {
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

            $scope.questions = {
                optionsAvailable: {
                    showing: false,
                    answer: undefined
                }
            };

            $scope.location = undefined;
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
            });
        }
    ]);
})(window.monkeyFace.controllersModule);
