(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgProductListItem', productListItemComponent());

    function productListItemComponent() {
        var component = {
            bindings: {
                product: '<vgProduct'
            },
            controller: ProductListItemComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/productListItem/productListItemComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // productListItemComponentController.$inject = ['exampleService'];

    function ProductListItemComponentController() {
        var vm = this;

        vm.$onInit = function() {

        };
    }
})();