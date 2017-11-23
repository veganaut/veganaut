(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCategorySelector', categorySelectorComponent());

    function categorySelectorComponent() {
        var component = {
            bindings: {},
            controller: CategorySelectorController,
            controllerAs: '$ctrl',
            templateUrl: 'components/ui/categorySelector/categorySelectorComponent.html'
        };

        return component;
    }

    CategorySelectorController.$inject = [
        'locationFilterService',
        'vgCategories'
    ];

    function CategorySelectorController(locationFilterService, vgCategories) {
        var $ctrl = this;

        $ctrl.typeFilters = [
            'gastronomy',
            'retail'
        ];

        $ctrl.groupFilters = [
            'location',
            'product'
        ];

        $ctrl.categories = vgCategories;
        $ctrl.selectedType = locationFilterService.activeFilters.type;
        $ctrl.selectedGroup = locationFilterService.activeFilters.group;

        $ctrl.$onInit = function() {
            if ($ctrl.typeFilters.indexOf(locationFilterService.activeFilters.type) === -1 ||
                $ctrl.groupFilters.indexOf(locationFilterService.activeFilters.group) === -1) {
                // If no type or group set, switch to restaurant by default
                $ctrl.setFilter('gastronomy', 'location');
                // This makes the component to be loaded twice. TODO: Find a better way to do it.
            }
        };

        $ctrl.setFilter = function(type, group) {
            $ctrl.selectedType = type;
            $ctrl.selectedGroup = group;
            locationFilterService.activeFilters.type = type;
            locationFilterService.activeFilters.group = group;
            locationFilterService.onFiltersChanged();
        };
    }
})();
