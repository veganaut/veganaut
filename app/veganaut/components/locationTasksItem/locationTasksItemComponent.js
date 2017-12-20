(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTasksItem', locationTasksItemComponent());

    function locationTasksItemComponent() {
        var component = {
            bindings: {
                task: '<vgTask'

            },
            controller: LocationTasksItemComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationTasksItem/locationTasksItemComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationTasksItemComponentController.$inject = ['exampleService'];

    function LocationTasksItemComponentController() {
        var vm = this;


        vm.$onInit = function() {

        };

    }
})();