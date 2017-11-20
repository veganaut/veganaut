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
            template: '<h1>Hello</h1>'
            //templateUrl: 'areaOverview.tpl.html'

        };
    }

    function areaOverviewCtrl() {
        var $ctrl = this;
        $ctrl.$onInit = function() {
            console.log('Test')
        };
    }

    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgAreaOverview', areaOverviewComponent);
})();
