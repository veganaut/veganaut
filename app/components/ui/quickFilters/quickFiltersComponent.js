(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgQuickFilters', quickFiltersComponent());

    /**
     * Component that allows to modify the currently active filter (type or quality)
     * and to access the full set of filters.
     */
    function quickFiltersComponent() {
        var component = {
            bindings: {
                hover: '<?vgHover'
            },
            controller: QuickFiltersController,
            templateUrl: 'components/ui/quickFilters/quickFiltersComponent.html'
        };

        return component;
    }

    QuickFiltersController.$inject = ['locationFilterService'];

    function QuickFiltersController(locationFilterService) {
        var $ctrl = this;

        $ctrl.locationFilterService = locationFilterService;

        $ctrl.filterToShow = function() {
            if (angular.isDefined($ctrl.locationFilterService.getTypeFilterValue())) {
                return 'category';
            }
            else {
                return 'quality';
            }
        };
    }
})();
