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
        '$location',
        'locationFilterService'
    ];

    function CategorySelectorController($location, locationFilterService) {
        var $ctrl = this;

        $ctrl.typeFilters = [
            'gastronomy',
            'retail'
        ];

        $ctrl.granularityFilters = [
            'location',
            'product'
        ];

        $ctrl.locationPath = $location.path();

        $ctrl.locationFilterService = locationFilterService;
        $ctrl.categories = locationFilterService.CATEGORIES;

        $ctrl.$onInit = function() {
            if ($ctrl.typeFilters.indexOf(locationFilterService.getTypeFilterValue()) === -1 ||
                $ctrl.granularityFilters.indexOf(locationFilterService.getGranularityFilterValue()) === -1) {
                // If no type or granularity set, switch to restaurant by default
                $ctrl.setFilter('gastronomy', 'location');
                // This makes the component to be loaded twice. TODO: Find a better way to do it.
            }
        };

        $ctrl.setFilter = function(type, granularity) {
            locationFilterService.activeFilters.type = type;
            locationFilterService.activeFilters.granularity = granularity;
            locationFilterService.onFiltersChanged();
        };
    }
})();
