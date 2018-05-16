(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationPane', locationPaneComponent());

    function locationPaneComponent() {
        var component = {
            require: {
                locationDetailsVm: '?^^vgLocationDetails'
            },
            bindings: {
                location: '<vgLocation',
                onClose: '&vgOnClose',

                // One of gastronomyLocation, retailLocation, gastronomyProduct and retailProduct
                viewCategory: '<vgViewCategory'
            },
            controller: LocationPaneComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationPane/locationPaneComponent.html'
        };

        return component;
    }

    function LocationPaneComponentController() {
        var vm = this;

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        };
    }
})();
