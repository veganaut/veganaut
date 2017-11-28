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
        'locationFilterService'
    ];

    function CategorySelectorController(locationFilterService) {
        var $ctrl = this;

        $ctrl.typeFilters = [
            'gastronomy',
            'retail'
        ];

        $ctrl.groupFilters = [
            'location',
            'product'
        ];

        $ctrl.categories = locationFilterService.CATEGORIES;
        $ctrl.selectedType = locationFilterService.getTypeFilterValue();
        $ctrl.selectedGroup = locationFilterService.getGroupFilterValue();

        $ctrl.$onInit = function() {
            if ($ctrl.typeFilters.indexOf(locationFilterService.getTypeFilterValue()) === -1 ||
                $ctrl.groupFilters.indexOf(locationFilterService.getGroupFilterValue()) === -1) {
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
