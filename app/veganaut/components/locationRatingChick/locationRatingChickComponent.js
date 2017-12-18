(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationRatingChick', locationRatingChickComponent());

    function locationRatingChickComponent() {
        var component = {
            bindings: {
            },
            controller: locationRatingChickController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationRatingChick/locationRatingChickComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // productListItemComponentController.$inject = ['exampleService'];

    function locationRatingChickController() {
        var vm = this;

        vm.$onInit = function() {

        };
    }
})();