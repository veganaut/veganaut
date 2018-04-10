(function() {
    'use strict';

    /**
     * Component for areaOverview. Presents all locations and products in one view
     * @returns {{controller: AreaOverviewCtrl, controllerAs: string, templateUrl: string}}
     */
    function areaOverviewComponent() {
        return {
            controller: AreaOverviewCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'veganaut/areaOverview/areaOverview.tpl.html'

        };
    }

    AreaOverviewCtrl.$inject = [
        '$scope',
        'backendService',
        'areaService'
    ];

    /**
     * Area Overview Controller
     */
    function AreaOverviewCtrl($scope, backendService, areaService) {
        var $ctrl = this;

        /**
         * Go back to show the overview of the last area with id
         */
        $ctrl.backToLastAreaWithId = function() {
            areaService.setArea(areaService.getLastAreaWithId());
            showArea(areaService.getCurrentArea());
        };

        /**
         * Last parameters that were used to query the items.
         * @type {{}}
         */
        var lastParams = {};

        /**
         * Resets the list to empty.
         * Note: this doesn't reset the area of the list.
         */
        var resetOverview = function() {
            $ctrl.areaOverview = {};

            $ctrl.areaType = undefined;
            $ctrl.area = undefined;
            $ctrl.lastAreaWithId = undefined;
            $ctrl.displayRadius = undefined;
        };

        /**
         * Loads the items with the currently set lastParams
         */
        var loadItems = function() {
            backendService.getAreaOverview(lastParams.lat, lastParams.lng, lastParams.radius).then(function(overview) {
                $ctrl.areaOverview = overview;
            });
        };

        var showArea = function(area) {
            // Get the radius params from the area
            lastParams = area.getRadiusParams();

            // Reset the area display variables and the list itself
            resetOverview();
            $ctrl.area = area;

            // Check what type of area we have
            $ctrl.areaType = area.getAreaType();
            if ($ctrl.areaType === 'withoutId') {
                // Area without id and therefore probably without name, ask the
                // service to retrieve a name for the center of the area
                areaService.retrieveNameForArea(area);
            }

            // If we have a last area with id and it's not the one already shown, we show a
            // button to go back to that area (= the last one the user selected explicitly)
            var lastAreaWithId = areaService.getLastAreaWithId();
            if (angular.isDefined(lastAreaWithId) && area.id !== lastAreaWithId.id) {
                // Expose the area to the template to show the button
                $ctrl.lastAreaWithId = lastAreaWithId;
            }

            // Round the radius to two significant digits and display it as meters or kms
            // TODO: this should be a filter
            var roundingHelper = Math.pow(10, ('' + lastParams.radius).length) / 100;
            var roundedRadius = Math.round(lastParams.radius / roundingHelper) * roundingHelper;
            if (roundedRadius < 1000) {
                $ctrl.displayRadius = roundedRadius + 'm';
            }
            else {
                $ctrl.displayRadius = (roundedRadius / 1000) + 'km';
            }

            // Load items with the newly set params
            loadItems();

            // Update the url
            // TODO WIP NOW: when going back to the last area with id or coming from search, it should add a new history entry
            areaService.writeAreaToUrl();
        };

        $ctrl.$onInit = function() {
            // Try to set the area from the URL params
            areaService.setAreaFromUrl()
                .finally(function() {
                    // Regardless if the area was set from the URL or not, show the current area
                    showArea(areaService.getCurrentArea());
                })
            ;

            // Listen to area changes
            $scope.$on('veganaut.area.changed', function() {
                showArea(areaService.getCurrentArea());
            });
        };
    }

    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgAreaOverview', areaOverviewComponent());
})();
