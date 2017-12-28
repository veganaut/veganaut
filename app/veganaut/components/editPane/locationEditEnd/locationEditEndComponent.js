
(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditEnd', locationEditEndComponent());

    function locationEditEndComponent() {
        var component = {
            bindings: {},
            controller: LocationEditEndComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/components/editPane/locationEditEnd/locationEditEndComponent.html'
        };

        return component;
    }

    // Inject dependencies
    LocationEditEndComponentController.$inject = ['animations'];

    function LocationEditEndComponentController(animations) {
        var vm = this;
        vm.animations = animations.animations;

        vm.$onInit = function() {
            spirit.setup()
            // load animation data
                .then(function() {
                    spirit.create(vm.animations).get('animation-01').construct()

                    // play gsap timeline
                        .yoyo(false)
                        .repeat(0)
                        .resume()

                })

        };
    }
})();