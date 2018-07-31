(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTasks', locationTasksComponent());

    // TODO WIP: rename to something with "veganize", use $ctrl instead of vm
    // TODO WIP: figure out how to use the styling from vg-location-products without using the CSS class names from there
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

    function LocationTasksComponentController() {
        var vm = this;
        vm.isTasksListExpanded = false;

        vm.onExpandCollapseToggleClick = function onExpandCollapseToggleClick() {
            vm.isTasksListExpanded = !vm.isTasksListExpanded;
        };
    }
})();
