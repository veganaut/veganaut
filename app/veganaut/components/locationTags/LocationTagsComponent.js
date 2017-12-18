(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationTags', locationTagsComponent());

    function locationTagsComponent() {
        var component = {
            bindings: {
                tags: '<vgTags',


                // Maximum number of products to show before displaying load more
                limit: '<vgLimit'
            },
            controller: LocationTagsComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationTags/locationTagsComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // locationProductSummaryComponentController.$inject = ['exampleService'];

    function LocationTagsComponentController() {
        var vm = this;

        vm.isProductListExpanded = false;

        vm.onExpandCollapseToggleClick = onExpandCollapseToggleClick;

        vm.$onInit = function() {

        };

        function onExpandCollapseToggleClick() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        }
    }
})();