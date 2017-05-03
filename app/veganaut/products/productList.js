(function() {
    'use strict';

    /**
     * Shows a list of products.
     * @returns {directive}
     *
     * @example
     * <vg-product-list></vg-product-list>
     */
    var productListDirective = function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * List of products to show
                 */
                products: '=vgProducts',

                /**
                 * Which address type to show for the locations of the products
                 */
                addressType: '@?vgAddressType'
            },
            controller: 'vgProductListCtrl',
            controllerAs: 'productListVm',
            bindToController: true,
            templateUrl: '/veganaut/products/productList.tpl.html'
        };
    };

    var productListCtrl = [
        'locationService',
        function(locationService) {
            var vm = this;

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
        }
    ];

    // Define the directive
    angular.module('veganaut.app.products')
        .controller('vgProductListCtrl', productListCtrl)
        .directive('vgProductList', productListDirective)
    ;
})();
