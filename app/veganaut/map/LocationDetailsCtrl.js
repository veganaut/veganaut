(function(controllersModule) {
    'use strict';

    controllersModule.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'locationService',
        function($scope, $routeParams, locationService) {
            var locationId = parseInt($routeParams.id);

            $scope.location = undefined;
            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        break;
                    }
                }
            });
        }
    ]);
})(window.monkeyFace.controllersModule);
