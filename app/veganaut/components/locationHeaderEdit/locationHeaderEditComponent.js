(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationHeaderEdit', locationHeaderEditComponent());

    function locationHeaderEditComponent() {
        var component = {
            require: {
                parent: '^^vgLocationDetails'
            },
            bindings: {
                // The location to show the title and icons for
                location: '<vgLocation'

            },
            controller: LocationHeaderEditComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/locationHeaderEdit/locationHeaderEditComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationHeaderEditComponentController.$inject = ['$translate'];

    function LocationHeaderEditComponentController() {
        var vm = this;

        vm.quality = 1;
        vm.locationType = null;

        vm.$onInit = function() {
        };
    }
})();