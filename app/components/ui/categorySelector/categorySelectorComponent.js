(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCategorySelector', categorySelectorComponent());

    function categorySelectorComponent() {
        var component = {
            bindings: {
                hover: '<?vgHover',
                isInFilterModal: '<?vgIsInFilterModal'
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
            return $ctrl.locationFilterService.POSSIBLE_ACTIVE_FILTERS.type;
        };

        $ctrl.getPossibleGranularityValues = function(type) {
            // We only show both granularities if the type is active or if we're in the filter modal
            if (type === $ctrl.locationFilterService.getTypeFilterValue() || $ctrl.isInFilterModal === true) {
                return $ctrl.locationFilterService.POSSIBLE_ACTIVE_FILTERS.granularity;
            }
            else {
                return ['location'];
            }
        };

        $ctrl.setFilter = function(type, granularity) {
            locationFilterService.setFilters({
                type: type,
                granularity: granularity
            });
        };
    }
})();
