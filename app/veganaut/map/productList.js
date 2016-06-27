(function() {
    'use strict';

    /**
     * Shows a list of products within the bounds of the current map.
     * @returns {directive}
     *
     * @example
     * <vg-product-list></vg-product-list>
     */
    var productListDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgProductListCtrl',
            controllerAs: 'productListVm',
            bindToController: true,
            templateUrl: '/veganaut/map/productList.tpl.html'
        };
    };

    var productListCtrl = [
        'locationService', '$location', 'backendService', 'leafletData', 'locationFilterService',
        function(locationService, $location, backendService, leafletData, locationFilterService) {
            var vm = this;

            // Bounds used to show the products
            var bounds;

            // Get a reference to the leaflet map object
            var mapPromise = leafletData.getMap();

            // Location type for which to show products
            // By default gastronomy, but if filter is set to retail, then that.
            vm.locationType = 'gastronomy';
            if (locationFilterService.activeFilters.type === 'retail') {
                vm.locationType = 'retail';
            }

            /**
             * Loaded products
             * @type {Array}
             */
            vm.products = [];

            /**
             * Total products available with the current query
             * @type {number}
             */
            vm.totalProducts = 0;

            /**
             * Whether the products have been loaded
             * @type {boolean}
             */
            vm.productsLoaded = false;

            /**
             * Load the next batch of products
             */
            vm.loadMore = function() {
                loadProducts(bounds, vm.locationType, vm.products.length);
            };

            /**
             * Handler for toggling the open state of a product in the list
             * @param {Product} product
             * @param {boolean} isOpen
             */
            vm.onOpenToggle = function(product, isOpen) {
                // Load the location data if the product was opened and we haven't yet loaded it
                if (isOpen && angular.isString(product.location)) {
                    locationService.getLocation(product.location)
                        .then(function(location) {
                            product.location = location;
                        })
                    ;
                }
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
                    vm.totalProducts = data.data.totalProducts;
                    vm.products = vm.products.concat(data.data.products);

                    // The products are now loaded
                    vm.productsLoaded = true;
                });
            }

            // When we get the map, load the products
            mapPromise.then(function(map) {
                // Get the bound of the map and load the products for the first time
                bounds = map.getBounds().toBBoxString();

                // Load products
                loadProducts(bounds, vm.locationType);
            });
        }
    ];

    // Define the directive
    angular.module('veganaut.app.map')
        .controller('vgProductListCtrl', productListCtrl)
        .directive('vgProductList', productListDirective)
    ;
})();
