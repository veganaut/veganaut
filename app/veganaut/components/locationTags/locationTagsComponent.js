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
                tags: '<vgTags'
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
            return (angular.isArray($ctrl.tags) && $ctrl.tags.length > 0);
        };
    }
})();
