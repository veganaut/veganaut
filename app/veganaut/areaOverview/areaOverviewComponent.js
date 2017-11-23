(function() {
    'use strict';


    /**
     * Component for areaOverview. Presents all restaurants and stores in one view
     * @returns {{controller: areaOverviewCtrl, controllerAs: string, templateUrl: string}}
     */
    function areaOverviewComponent() {
        return {
            controller: areaOverviewCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'veganaut/areaOverview/areaOverview.tpl.html'

        };
    }

    areaOverviewCtrl.$inject = [
        'areaOverview',
        'locationFilterService',
        '$location'
    ];


    /**
     * Area Overview Controller
     *
     * TODO Thinking about to move the plant stuff to a own directive
     * @param locationFilterService
     * @param $location
     */
    function areaOverviewCtrl(areaOverview, locationFilterService, $location) {
        this.ratingPlants = {
            'ratingPlant1': {
                'visible': true,
                'tooltip': false
            },
            'ratingPlant2': {
                'visible': true,
                'tooltip': false
            },
            'ratingPlant3': {
                'visible': true,
                'tooltip': false
            },
            'ratingPlant4': {
                'visible': true,
                'tooltip': false
            },
            'ratingPlant5': {
                'visible': true,
                'tooltip': false
            }
        };
        var $ctrl = this;
        $ctrl.areaOverview = areaOverview;
        $ctrl.current = false;
        $ctrl.$onInit = function() {
            // Call to backend for data
        };

        /**
         * Function to show the plants right if clicked
         * TODO make cleaner
         * @param plantId
         */
        $ctrl.toggle = function(plantId) {
            for (var plant in this.ratingPlants) {
                if (this.ratingPlants.hasOwnProperty(plant)) {
                    if (plant === plantId && this.ratingPlants[plant].tooltip) {
                        for (var p in this.ratingPlants) {
                            if (this.ratingPlants.hasOwnProperty(p)) {
                                this.ratingPlants[p].visible = true;
                            }
                        }
                        this.ratingPlants[plant].tooltip = false;
                    }
                    else if (plant === plantId && !this.ratingPlants[plant].tooltip) {
                        for (var p in this.ratingPlants) {
                            if (this.ratingPlants.hasOwnProperty(p)) {
                                this.ratingPlants[p].visible = false;
                                this.ratingPlants[p].tooltip = false;
                            }
                        }
                        this.ratingPlants[plant].tooltip = true;
                        this.ratingPlants[plant].visible = true;
                    }
                }
            }
        };

        /**
         * Checks if a tooltip is open, so the size can be adjusted
         * @returns {boolean}
         */
        $ctrl.tooltipOpen = function() {
            var bool = false;
            for (var plant in this.ratingPlants) {
                if (this.ratingPlants.hasOwnProperty(plant)) {
                    if (this.ratingPlants[plant].tooltip) {
                        bool = true;
                    }
                }
            }
            return bool;
        };

        $ctrl.redirectTo = function(type, kind) {
            locationFilterService.activeFilters.type = locationFilterService.POSSIBLE_FILTERS.type[type];
            locationFilterService.activeFilters.kind = locationFilterService.POSSIBLE_FILTERS.kind[kind];
            $location.path('/list');

        }
    }


    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgAreaOverview', areaOverviewComponent());
})();
