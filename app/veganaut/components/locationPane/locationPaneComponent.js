(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationPane', locationPaneComponent());

    function locationPaneComponent() {
        var component = {
            require: {
                locationDetailsVm: '?^^vgLocationDetails',
                parentVm: '^vgMainMap'
            },
            bindings: {
                location: '<vgLocation'
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
