(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCard', cardComponent());

    function cardComponent() {
        var component = {
            template: '<div class="vg-card" ng-transclude></div>',
            transclude: true
        };

        return component;
    }
})();
