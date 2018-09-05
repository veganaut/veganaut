(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCategorySelector', categorySelectorComponent());

    function categorySelectorComponent() {
        var component = {
            bindings: {
                hover: '<?vgHover'
            },
            controller: CategorySelectorController,
            templateUrl: 'components/ui/categorySelector/categorySelectorComponent.html'
        };

        return component;
    }

    CategorySelectorController.$inject = ['locationFilterService'];

    function CategorySelectorController(locationFilterService) {
        var $ctrl = this;

        $ctrl.locationFilterService = locationFilterService;

        $ctrl.setFilter = function(type, granularity) {
            locationFilterService.activeFilters.type = type;
            locationFilterService.activeFilters.granularity = granularity;
            locationFilterService.onFiltersChanged();
        };
    }
})();
