(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTasksItem', locationTasksItemComponent());

    function locationTasksItemComponent() {
        var component = {
            require: {
                locationDetailsCtrl: '^^vgLocationDetails'
            },
            bindings: {
                task: '<vgTask'
            },
            controller: LocationTasksItemComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationTasksItem/locationTasksItemComponent.html'
        };

        return component;
    }

    function LocationTasksItemComponentController() {
    }
})();
