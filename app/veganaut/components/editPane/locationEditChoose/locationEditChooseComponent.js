(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditChoose', locationEditChooseComponent());

    function locationEditChooseComponent() {
        var component = {
            bindings: {
            },
            controller: LocationEditChooseComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditChoose/locationEditChooseComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditChooseComponentController.$inject = ['exampleService'];

    function LocationEditChooseComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();