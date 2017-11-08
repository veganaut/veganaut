(function() {
    'use strict';

    angular
        .module('veganaut.app.location')
        .component('vgLocationHeader', locationHeaderComponent());

    function locationHeaderComponent() {
        var component = {
            bindings: {
                // The location to show the title and icons for
                location: '<vgLocation',

                // Which part of the address (if any) should be shown
                // Defaults to no address shown
                addressType: '@?vgAddressType',

            },
            controller: LocationHeaderComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/location/locationHeaderComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationHeaderComponentController.$inject = ['exampleService'];

    function LocationHeaderComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();