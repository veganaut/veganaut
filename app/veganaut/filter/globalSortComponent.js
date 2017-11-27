(function() {
    'use strict';

    angular
        .module('veganaut.app.filter')
        .component('vgGlobalSort', globalSortComponent());

    function globalSortComponent() {
        return {
            bindings: {
                'onClose': '&vgOnClose'
            },
            controller: GlobalSortController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/filter/globalSortComponent.html'
        };
    }

    GlobalSortController.$inject = [
        'locationFilterService'
    ];

    function GlobalSortController(locationFilterService) {
        var $ctrl = this;

        // Expose the filter service
        $ctrl.locationFilterService = locationFilterService;

        $ctrl.sortToggles = [
            'quality',
            'distance',
            'lastUpdate'
        ];

        $ctrl.activeToggle = locationFilterService.getSortByValue();

        $ctrl.onChange = function(sortToggleName, active) {
            if (active) {
                $ctrl.activeToggle = sortToggleName;
            }
            else {
                $ctrl.activeToggle = 'none';
            }
        };

        $ctrl.onSave = function() {
            locationFilterService.activeFilters.sortBy = $ctrl.activeToggle;
            locationFilterService.onFiltersChanged();
            $ctrl.onClose();
        };
    }
})();
