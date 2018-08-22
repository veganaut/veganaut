(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationProducts', locationProductsComponent());

    function locationProductsComponent() {
        var component = {
            require: {
                parent: '^^?vgLocationDetails'
            },
            bindings: {
                location: '<vgLocation',
                isPreview: '<vgIsPreview',

                // Maximum number of products to show before displaying load more
                limit: '<vgLimit'
            },
            controller: LocationProductsComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationProducts/locationProductsComponent.html'
        };

        return component;
    }

    function LocationProductsComponentController() {
        var vm = this;

        vm.isProductListExpanded = false;

        vm.showNotAvailableProducts = false;

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;

            // Hide the not available products again when collapsing
            if (vm.isProductListExpanded === false) {
                vm.showNotAvailableProducts = false;
            }
        };
    }
})();
