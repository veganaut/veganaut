(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditMulti', locationEditMultiComponent());

    function locationEditMultiComponent() {
        var component = {
            bindings: {
            },
            controller: LocationEditMultiComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditMulti/locationEditMultiComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditMultiComponentController.$inject = ['exampleService'];

    function LocationEditMultiComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();