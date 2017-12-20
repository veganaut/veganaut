(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditSingle', locationEditSingleComponent());

    function locationEditSingleComponent() {
        var component = {
            bindings: {
            },
            controller: LocationEditSingleComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditSingle/locationEditSingleComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditSingleComponentController.$inject = ['exampleService'];

    function LocationEditSingleComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();