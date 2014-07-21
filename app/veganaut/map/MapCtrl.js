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
        }
    ]);
})(window.monkeyFace.controllersModule);
