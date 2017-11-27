(function() {
    'use strict';


    /**
     * Component for areaOverview. Presents all restaurants and stores in one view
     * @returns {{controller: PlantRatingCtrl, controllerAs: string, templateUrl: string}}
     */
    function plantRatingComponent() {
        return {
            controller: PlantRatingCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'veganaut/areaOverview/plantRating/plantRating.tpl.html'

        };
    }

    PlantRatingCtrl.$inject = [
        'areaOverview'
    ];


    /**
     * Plant Controller
     *
     */
    function PlantRatingCtrl(areaOverview) {
        this.areaOverview = areaOverview;
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
        $ctrl.current = false;
        /**
         * Function to show the plants right if clicked
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
    }


    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgPlantRating', plantRatingComponent());
})();
