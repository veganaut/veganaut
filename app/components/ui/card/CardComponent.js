(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCard', cardComponent());

    function cardComponent() {
        var component = {
            template: '<div class="vg-card" ng-transclude></div>',
            transclude: true,
            // bindings: {
            //     myBinding1: '<myBinding',
            //     myBinding2: '@?myBinding'
            // },
            controller: CardComponentController,
            controllerAs: 'vm'
            // templateUrl: 'veganaut/components/ui/cardComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // cardComponentController.$inject = ['exampleService'];

    function CardComponentController() {
        var vm = this;

        vm.$onInit = function() {

        };
    }
})();