(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationPane', locationPaneComponent());

    function locationPaneComponent() {
        var component = {
            bindings: {
                location: '<vgLocation',
                parentVm: '<vgParentVm',
            },
            controller: LocationPaneComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationPane/locationPaneComponent.html'
        };

        return component;
    }

    LocationPaneComponentController.$inject = [
    ];

    function LocationPaneComponentController() {
        var vm = this;

        vm.onExpandCollapseToggleClick = function() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        };

    }
})();