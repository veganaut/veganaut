(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditChoose', locationEditChooseComponent());

    function locationEditChooseComponent() {
        var component = {
            bindings: {
                'edit': '<vgEdit'
            },
            controller: LocationEditChooseComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditChoose/locationEditChooseComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // LocationEditChooseComponentController.$inject = ['exampleService'];

    function LocationEditChooseComponentController() {
        var vm = this;

        this.answers = {
            'yes': {
                'visible': false
            },
            'no': {
                'visible': false
            },
            'maybe': {
                'visible': false
            }
        };

        /**
         * Function to show the plants right if clicked
         * @param buttonId
         */
        this.toggle = function(buttonId) {
            for (var answer in this.answers) {
                if (this.answers.hasOwnProperty(answer)) {
                    this.answers[answer].visible = answer === buttonId;
                }
            }
        };

        vm.$onInit = function() {
        };
    }
})();