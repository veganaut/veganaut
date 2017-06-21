(function() {
    'use strict';

    /**
     * This page component shows a list of products in the current area.
     * @type {{}}
     */
    var productListPageComponent = {
        controller: 'vgProductListPageCtrl',
        templateUrl: '/veganaut/products/productListPage.tpl.html'
    };

    var productListPageCtrl = [
        'backendService', 'locationFilterService',
        function(backendService, locationFilterService) {
            var $ctrl = this;

            $ctrl.loadProducts = function(lat, lng, radius, limit, skip) {
                return backendService.getProducts(
                    lat, lng, radius,
                    locationFilterService.getTypeFilterValue(),
                    skip, limit
                ).then(function(res) {
                    return {
                        totalItems: res.data.totalProducts,
                        items: res.data.products
                    };
                });
            };
        }
    ];

    // Expose as component
    angular.module('veganaut.app.products')
        .controller('vgProductListPageCtrl', productListPageCtrl)
        .component('vgProductListPage', productListPageComponent)
    ;
})();
