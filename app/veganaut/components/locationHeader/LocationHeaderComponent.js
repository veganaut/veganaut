(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationHeader', locationHeaderComponent());

    function locationHeaderComponent() {
        var component = {
            require: {
                parent: '^^vgLocationDetails'
            },
            bindings: {
                // The location to show the title and icons for
                location: '<vgLocation',

                // Which part of the address (if any) should be shown
                // Defaults to no address shown
                addressType: '@?vgAddressType'

            },
            controller: LocationHeaderComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/locationHeader/locationHeaderComponent.html'
        };

        return component;
    }

    function LocationHeaderComponentController() {
        var vm = this;

        vm.quality = 1;
        vm.locationType = null;

        vm.$onInit = function() {
            vm.quality = vm.location.getRoundedQuality();
            vm.locationType = vm.location.type;
        };
    }
})();
