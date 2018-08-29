(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgCard', cardComponent());

    function cardComponent() {
        var component = {
            bindings: {
                largeFont: '<?vgLargeFont'
            },
            template: '<div class="vg-card" ng-class="{ \'vg-card--large-font\': $ctrl.largeFont }" ng-transclude></div>',
            transclude: true
        };

        return component;
    }
})();
