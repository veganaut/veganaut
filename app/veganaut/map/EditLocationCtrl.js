(function(module) {
    'use strict';

    module.controller('EditLocationCtrl',
        ['$scope', '$routeParams', 'locationService', 'Location',
            function($scope, $routeParams, locationService, Location) {
                var locationId = $routeParams.id;

                $scope.location = undefined;

                /**
                 * Expose the location types
                 * @type {{}}
                 */
                $scope.locationTypes = Location.TYPES;

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
