(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationProducts', locationProductsComponent());

    function locationProductsComponent() {
        var component = {
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

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        };
    }
})();
