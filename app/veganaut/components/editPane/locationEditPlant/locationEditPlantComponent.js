(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditPlant', locationEditPlantComponent());

    function locationEditPlantComponent() {
        var component = {
            bindings: {
                'edit': '<vgEdit'
            },
            controller: LocationEditPlantComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditPlant/locationEditPlantComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditPlantComponentController.$inject = ['exampleService'];

    function LocationEditPlantComponentController() {
        var vm = this;
        this.ratingPlants = {
            'ratingPlant1': {
                'visible': false
            },
            'ratingPlant2': {
                'visible': false
            },
            'ratingPlant3': {
                'visible': false
            },
            'ratingPlant4': {
                'visible': false
            },
            'ratingPlant5': {
                'visible': false
            }
        };
        /**
         * Function to show the plants right if clicked
         * @param plantId
         */
        this.toggle = function(plantId) {
            for (var plant in this.ratingPlants) {
                if (this.ratingPlants.hasOwnProperty(plant)) {
                    this.ratingPlants[plant].visible = plant === plantId;
                }
            }
        };


        vm.$onInit = function() {
        };
    }
})();