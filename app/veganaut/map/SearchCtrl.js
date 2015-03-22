(function (module) {
    'use strict';

    module.controller('SearchCtrl', ['$scope', '$location', '$timeout', 'leafletData',
        'playerService', 'backendService', 'geocodeService',
        function ($scope, $location, $timeout, leafletData,
                  playerService, backendService, geocodeService) {
            // Geocoding search string model and results
            $scope.geocoding = {
                search: '',
                results: [],
                resultsShown: true
            };

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();

            /**
             * Selects the given geocode result as the coordinates
             * for the new location
             * @param {GeocodeResult} result
             */
            $scope.setGeocodeResult = function (result) {
                // Hide the results
                $scope.geocoding.resultsShown = false;

                // Set coordinates
                $scope.setNewLocationCoordinates(
                    result.lat,
                    result.lng
                );

                // Fit to the bounds of the result
                if (angular.isArray(result.bounds)) {
                    mapPromise.then(function (map) {
                        map.fitBounds(result.bounds);
                    });
                }
            };

            // Watch the geocoding search string
            $scope.$watch('geocoding.search', function (search) {
                // TODO: move constants somewhere else
                // Reset results
                $scope.geocoding.results = [];

                // Only start new query if the string is long enough
                if (!angular.isString(search) || search.length < 4) {
                    return;
                }

                // Lookup the search string
                geocodeService.search($scope.geocoding.search)
                    .then(function (data) {
                        $scope.geocoding.results = data;
                    })
                ;
            });

        }
    ]);
})(window.veganaut.mapModule);
