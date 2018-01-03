(function() {
    'use strict';


    /**
     * Component for areaOverview. Presents all restaurants and stores in one view
     * @returns {{controller: areaOverviewCtrl, controllerAs: string, templateUrl: string}}
     */
    function areaOverviewComponent() {
        return {
            controller: AreaOverviewCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'veganaut/areaOverview/areaOverview.tpl.html'

        };
    }

    AreaOverviewCtrl.$inject = [
        'areaOverview',
        'locationFilterService',
        '$location'
    ];


    /**
     * Area Overview Controller
     *
     * @param areaOverview
     * @param locationFilterService
     * @param $location
     */
    function AreaOverviewCtrl(areaOverview, locationFilterService, $location) {
        var $ctrl = this;
        $ctrl.areaOverview = areaOverview;
        $ctrl.current = false;
        $ctrl.$onInit = function() {
            // TODO Call to backend for data
        };

        $ctrl.redirectTo = function(type, group, path) {
            locationFilterService.activeFilters.type = locationFilterService.POSSIBLE_FILTERS.type[type];
            locationFilterService.activeFilters.group = locationFilterService.POSSIBLE_FILTERS.group[group];
            $location.path(path);
        };
    }


    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgAreaOverview', areaOverviewComponent());
})();
