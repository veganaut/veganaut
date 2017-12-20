(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTasks', locationTasksComponent());

    function locationTasksComponent() {
        var component = {
            bindings: {
                tasks: '<vgTasks',
                limit: '<vgLimit'

            },
            controller: LocationTasksComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationTasks/locationTasksComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationTasksComponentController.$inject = ['exampleService'];

    function LocationTasksComponentController() {
        var vm = this;
        vm.isTasksListExpanded = false;

        vm.$onInit = function() {

        };

        vm.onExpandCollapseToggleClick = function onExpandCollapseToggleClick() {
            vm.isTasksListExpanded = !vm.isTasksListExpanded;
        }
    }
})();