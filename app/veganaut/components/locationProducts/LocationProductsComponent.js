(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationProducts', locationProductsComponent());

    function locationProductsComponent() {
        var component = {
            bindings: {
                location: '<vgLocation',

                // Maximum number of products to show before displaying load more
                limit: '<vgLimit'
            },
            controller: LocationProductsComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationProducts/locationProductsComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // locationProductSummaryComponentController.$inject = ['exampleService'];

    function LocationProductsComponentController() {
        var vm = this;

        vm.isProductListExpanded = false;

        vm.onExpandCollapseToggleClick = onExpandCollapseToggleClick;

        vm.$onInit = function() {

        };

        function onExpandCollapseToggleClick() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        }
    }
})();