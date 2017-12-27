(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditStar', locationEditStarComponent());

    function locationEditStarComponent() {
        var component = {
            bindings: {
                'edit': '<vgEdit'
            },
            controller: LocationEditStarComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditStar/locationEditStarComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditPlantComponentController.$inject = ['exampleService'];

    function LocationEditStarComponentController() {
        var vm = this;

        vm.$onInit = function() {
        };
    }
})();