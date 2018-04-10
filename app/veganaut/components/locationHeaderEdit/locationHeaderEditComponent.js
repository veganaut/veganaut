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

    function LocationHeaderEditComponentController() {
        var vm = this;

        vm.quality = 1;
        vm.locationType = null;
    }
})();
