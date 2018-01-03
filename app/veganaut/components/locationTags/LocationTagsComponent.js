(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTags', locationTagsComponent());

    function locationTagsComponent() {
        var component = {
            require: {
                parent: '^^vgLocationDetails'
            },
            bindings: {
                tags: '<vgTags'
            },
            controller: LocationTagsComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationTags/locationTagsComponent.html'
        };

        return component;
    }

    function LocationTagsComponentController() {
        var vm = this;

        vm.isExpanded = false;

        vm.onExpandCollapseToggleClick = function onExpandCollapseToggleClick() {
            vm.isExpanded = !vm.isExpanded;
        };
    }
})();
