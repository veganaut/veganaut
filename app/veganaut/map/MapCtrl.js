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
                    lng: 7.451
                },
                test2: {
                    lat: 46.945,
                    lng: 7.456
                },
                test3: {
                    lat: 46.95,
                    lng: 7.459
                },
                test4: {
                    lat: 46.94,
                    lng: 7.44
                }
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
