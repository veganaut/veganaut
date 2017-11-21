(function() {
    'use strict';

    /**
     * Component for showing a paginated list of items (products or locations)
     * within a given area.
     * Reads the area from the URL and listens to changes in area and filters.
     * @type {{}}
     */
    function areaOverviewComponent() {
        return {
            controller: areaOverviewCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'veganaut/areaOverview/areaOverview.tpl.html'

        };
    }

    function areaOverviewCtrl() {
        var $ctrl = this;
        $ctrl.$onInit = function() {
        };
    }

    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgAreaOverview', areaOverviewComponent());
})();
