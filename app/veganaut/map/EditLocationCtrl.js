(function(module) {
    'use strict';

    module.controller('EditLocationCtrl',
        ['$scope', '$routeParams', 'locationService',
            function($scope, $routeParams, locationService) {
                var locationId = $routeParams.id;

                $scope.location = undefined;

                $scope.saveLocation = function() {
                    locationService.updateLocation($scope.location);
                    $scope.goToView($scope.location.getUrl());
                };

                // Get the location
                locationService.getLocation(locationId).then(function(location) {
                    // TODO: handle location not found
                    $scope.location = location;
                });
            }
        ]);
})(window.veganaut.mapModule);
