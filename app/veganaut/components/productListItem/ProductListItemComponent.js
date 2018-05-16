(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgProductListItem', productListItemComponent());

    function productListItemComponent() {
        var component = {
            require: {
                locationDetailsVm: '?^^vgLocationDetails',
                parentVm: '^vgLocationProducts'
            },
            bindings: {
                product: '<vgProduct'
            },
            controller: ProductListItemComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/productListItem/productListItemComponent.html'
        };

        return component;
    }

    function ProductListItemComponentController() {
        var vm = this;

        vm.isProductListExpanded = false;

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        };
    }
})();
