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

    LocationProductsComponentController.$inject = ['angularPiwik'];
    function LocationProductsComponentController(angularPiwik) {
        var vm = this;

        vm.isProductListExpanded = false;

        vm.showNotAvailableProducts = false;

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
            angularPiwik.track('location.productList', 'location.productList.' +
                (vm.isProductListExpanded ? 'open' : 'close'));

            // Hide the not available products again when collapsing
            if (vm.isProductListExpanded === false) {
                vm.showNotAvailableProducts = false;
            }
        };
    }
})();
