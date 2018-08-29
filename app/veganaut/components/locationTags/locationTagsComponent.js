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

    function LocationTagsComponentController() {
        var $ctrl = this;

        $ctrl.isExpanded = false;

        $ctrl.onExpandCollapseToggleClick = function() {
            $ctrl.isExpanded = !$ctrl.isExpanded;
        };

        $ctrl.hasTags = function() {
            return (angular.isArray($ctrl.tags) && $ctrl.tags.length > 0);
        };
    }
})();
