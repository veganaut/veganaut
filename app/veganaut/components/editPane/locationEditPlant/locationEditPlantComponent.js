(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditPlant', locationEditPlantComponent());

    function locationEditPlantComponent() {
        var component = {
            bindings: {
            },
            controller: LocationEditPlantComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditPlant/locationEditPlantComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditPlantComponentController.$inject = ['exampleService'];

    function LocationEditPlantComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();