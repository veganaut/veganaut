(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationRatingChick', locationRatingChickComponent());

    function locationRatingChickComponent() {
        var component = {
            bindings: {
            },
            controller: LocationRatingChickController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationRatingChick/locationRatingChickComponent.html'
        };

        return component;
    }

    function LocationRatingChickController() {
        var vm = this;

        vm.$onInit = function() {

        };
    }
})();
