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

        $ctrl.getPossibleTypeValues = function() {
            return ['gastronomy', 'retail'];
        };

        $ctrl.getPossibleGranularityValues = function(type) {
            // We only show both granularities if the type is active
            if (type === $ctrl.locationFilterService.getTypeFilterValue()) {
                return $ctrl.locationFilterService.POSSIBLE_FILTERS.granularity;
            }
            else {
                return ['location'];
            }
        };

        $ctrl.setFilter = function(type, granularity) {
            locationFilterService.activeFilters.type = type;
            locationFilterService.activeFilters.granularity = granularity;
            locationFilterService.onFiltersChanged();
        };

        $ctrl.switchToQualityFilter = function() {
            locationFilterService.activeFilters.type = 'anytype';
            locationFilterService.activeFilters.granularity = 'location';
            locationFilterService.activeFilters.minQuality = 4;
            locationFilterService.activeFilters.maxQuality = 5;
            locationFilterService.onFiltersChanged();
        };
    }
})();
