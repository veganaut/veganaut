(function(module) {
    'use strict';
    module.controller('ProductListCtrl', [
        '$scope', 'locationService', '$location', 'backendService', 'leafletData',
        function($scope, locationService, $location, backendService, leafletData) {
            // Bounds used to show the products
            var bounds;

            // Location type for which to show products
            // At the moment hard-coded to gastronomy
            var locationType = 'gastronomy';

            // Promise for getting the locations
            var locationPromise;

            // Get a reference to the leaflet map object
            var mapPromise = leafletData.getMap();

            /**
             * Loaded products
             * @type {Array}
             */
            $scope.products = [];

            /**
             * Total products available with the current query
             * @type {number}
             */
            $scope.totalProducts = 0;

            /**
             * Whether the products have been loaded
             * @type {boolean}
             */
            $scope.productsLoaded = false;

            /**
             * Load the next batch of products
             */
            $scope.loadMore = function() {
                loadProducts(bounds, locationType, $scope.products.length);
            };

            /**
             * Load products withing the given bounds
             * @param {string} bounds
             * @param {string} [locationType]
             * @param {number} [skip=0]
             */
            function loadProducts(bounds, locationType, skip) {
                // Get products from the backend
                backendService.getProducts(bounds, locationType, skip || 0).then(function(data) {
                    $scope.totalProducts = data.data.totalProducts;
                    populateLocations(data.data.products);
                });
            }

            /**
             * Populate the locationId in the given products with the location object.
             * @param {[]} products
             */
            function populateLocations(products) {
                locationPromise.then(function() {
                    var locationSet = locationService.getLocationSet();

                    // Go through all the products to find its location
                    angular.forEach(products, function(product) {
                        if (angular.isObject(locationSet.locations[product.location])) {
                            product.location = locationSet.locations[product.location];
                            $scope.products.push(product);
                        }
                        // If we couldn't find the location, don't show the product
                    });

                    // The products are now loaded
                    $scope.productsLoaded = true;
                });
            }

            // When we get the map, load the products
            mapPromise.then(function(map) {
                // Get the bound of the map and load the products for the first time
                bounds = map.getBounds().toBBoxString();

                // Get the locations (to set them in the products)
                locationPromise = locationService.queryByBounds(bounds);

                // Load products
                loadProducts(bounds, locationType);
            });
        }
    ]);
})(window.veganaut.mapModule);
