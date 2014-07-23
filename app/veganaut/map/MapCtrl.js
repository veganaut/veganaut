(function(controllersModule) {
    'use strict';

    controllersModule.controller('MapCtrl', ['$scope',
        function($scope) {
            $scope.mapSettings =  {
                tileLayer: 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png'
            };

            $scope.center = {
                lat: 46.949,
                lng: 7.451,
                zoom: 14
            };

            $scope.markers = {
                test1: {
                    lat: 46.949,
                    lng: 7.451,
                    message: 'Some place'
                },
                test2: {
                    lat: 46.945,
                    lng: 7.456,
                    message: 'Some other place'
                },
                test3: {
                    lat: 46.95,
                    lng: 7.459,
                    message: 'Great place'
                },
                test4: {
                    lat: 46.94,
                    lng: 7.44,
                    message: 'Soon to be great place'
                }
            };

            $scope.focusedMarker = function() {
                for (var markerName in $scope.markers) {
                    if ($scope.markers.hasOwnProperty(markerName) && $scope.markers[markerName].focus === true) {
                        return $scope.markers[markerName];
                    }
                }
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
