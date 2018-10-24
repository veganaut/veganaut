(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTags', locationTagsComponent());

    function locationTagsComponent() {
        var component = {
            require: {
                parent: '^^?vgLocationDetails'
            },
            bindings: {
                location: '<vgLocation'
            },
            controller: LocationTagsComponentController,
            templateUrl: 'veganaut/components/locationTags/locationTagsComponent.html'
        };

        return component;
    }

    LocationTagsComponentController.$inject = ['angularPiwik'];
    function LocationTagsComponentController(angularPiwik) {
        var $ctrl = this;

        $ctrl.isExpanded = false;

        $ctrl.onExpandCollapseToggleClick = function() {
            $ctrl.isExpanded = !$ctrl.isExpanded;
            angularPiwik.track('location.tags', 'location.tags.' + ($ctrl.isExpanded ? 'open' : 'close'));
        };

        $ctrl.hasTags = function() {
            var tags = $ctrl.location.getSortedTags();
            return (angular.isArray(tags) && tags.length > 0);
        };
    }
})();
