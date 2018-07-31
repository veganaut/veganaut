(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationVeganizeTaskItem', locationVeganizeTaskItemComponent());

    function locationVeganizeTaskItemComponent() {
        var component = {
            require: {
                locationDetailsCtrl: '^^vgLocationDetails'
            },
            bindings: {
                task: '<vgTask'
            },
            templateUrl: 'veganaut/components/locationVeganizeTaskItem/locationVeganizeTaskItemComponent.html'
        };

        return component;
    }
})();
