(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditSelect', locationEditSelectComponent());

    function locationEditSelectComponent() {
        var component = {
            bindings: {
            },
            controller: LocationEditSelectComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditSelect/locationEditSelectComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditSelectComponentController.$inject = ['exampleService'];

    function LocationEditSelectComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();