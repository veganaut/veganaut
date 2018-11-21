(function() {
    'use strict';

    angular
        .module('veganaut.app.filter')
        .component('vgGlobalFilters', globalFiltersComponent());

    /**
     * Component definition for the global filters. Shows a form to edit all
     * the filters.
     */
    function globalFiltersComponent() {
        var component = {
            controller: GlobalFiltersController,
            templateUrl: 'veganaut/filter/globalFilters/globalFiltersComponent.html'
        };

        return component;
    }

    GlobalFiltersController.$inject = ['locationFilterService'];

    function GlobalFiltersController(locationFilterService) {
        var $ctrl = this;

        // Expose the filter service
        $ctrl.locationFilterService = locationFilterService;
    }
})();
