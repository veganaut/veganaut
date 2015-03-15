(function(module) {
    'use strict';
    module.controller('ProductListCtrl', [
        '$scope', 'locationService', '$location', 'backendService', 'leafletData',
        function($scope, locationService, $location, backendService, leafletData) {
            $scope.products = [];
            $scope.totalProducts = 0;

            // Get a reference the the leaflet map object
            var mapPromise = leafletData.getMap();
            mapPromise.then(function(map) {
                // Get the bound of the map
                var bounds = map.getBounds();
                var coords = bounds.toBBoxString();

                //Get products from the backend
                backendService.getProducts(coords, 10, 0).then(function(data) {
                    $scope.products = data.data.products;
                    $scope.totalProducts = data.data.totalProducts;
                    populateLocations();
                });
            });

            /**
             * Check if a location id matches id in product and populate the locationId
             * in product with the location object
             */
            function populateLocations() {
                locationService.getLocations().then(function(locations) {
                    // TODO: get locations should be cached
                    angular.forEach($scope.products, function(product) {
                        if (angular.isObject(locations[product.location])) {
                            product.location = locations[product.location];
                        }
                        // TODO: else what?
                    });
                });
            }

            /**
             * Which product is currently shown
             * @type {{}}
             */
            $scope.openedProduct = undefined;

            /**
             * Shows the details of the given product.
             * If the it's already shown, it's hidden.
             * @param {{}} product
             */
            $scope.openProduct = function(product) {
                if ($scope.openedProduct === product) {
                    $scope.openedProduct = undefined;
                }
                else {
                    $scope.openedProduct = product;
                }
            };
        }
    ]);
})(window.veganaut.mapModule);
