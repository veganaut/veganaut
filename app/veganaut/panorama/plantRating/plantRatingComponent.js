(function() {
    'use strict';

    /**
     * Component for showing the location quality overview on the panorama page
     * @returns {{}}
     */
    function plantRatingComponent() {
        return {
            bindings: {
                panorama: '<vgPanorama'
            },
            controller: PlantRatingCtrl,
            templateUrl: 'veganaut/panorama/plantRating/plantRatingComponent.html'
        };
    }

    function PlantRatingCtrl() {
        this.ratingPlants = {
            ratingPlant0: {
                visible: true,
                tooltip: false
            },
            ratingPlant1: {
                visible: true,
                tooltip: false
            },
            ratingPlant2: {
                visible: true,
                tooltip: false
            },
            ratingPlant3: {
                visible: true,
                tooltip: false
            },
            ratingPlant4: {
                visible: true,
                tooltip: false
            },
            ratingPlant5: {
                visible: true,
                tooltip: false
            }
        };
        var $ctrl = this;

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
                        for (var r in this.ratingPlants) {
                            if (this.ratingPlants.hasOwnProperty(r)) {
                                this.ratingPlants[r].visible = false;
                                this.ratingPlants[r].tooltip = false;
                            }
                        }
                        this.ratingPlants[plant].tooltip = true;
                        this.ratingPlants[plant].visible = true;
                    }
                }
            }
        };
    }

    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgPlantRating', plantRatingComponent());
})();
