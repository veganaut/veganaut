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
            // Destroy Sorting
            vm.mockTags = [
                {'name': 'gBreakfast', 'weight': 1}, {'name': 'gDinner', 'weight': 1},
                {'name': 'gLunch', 'weight': 3}, {'name': 'gSweets', 'weight': 2}, {
                    'name': 'rnBooks',
                    'weight': 4
                }, {'name': 'gLunch', 'weight': 3}, {'name': 'gSweets', 'weight': 2}, {'name': 'rnBooks', 'weight': 4}]
        };

        function onExpandCollapseToggleClick() {
            vm.isProductListExpanded = !vm.isProductListExpanded;
        }
    }
})();