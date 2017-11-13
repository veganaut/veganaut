(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgLocationTypeIndicator', locationTypeIndicatorComponent());

    function locationTypeIndicatorComponent() {
        var component = {
            bindings: {
                value: '<vgValue',
                label: '<?vgLabel',
                labelVisible: '<?vglabelVisible'
            },
            controller: LocationTypeIndicatorComponentController,
            controllerAs: 'vm',
            templateUrl: 'components/ui/locationTypeIndicator/locationTypeIndicatorComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // QualityIndicatorComponentController.$inject = ['$translate'];

    function LocationTypeIndicatorComponentController() {
        var vm = this;

        vm.activeIcon = null;
        vm.ratingLabel = '';

        var icons = {
            gastronomy: 'restaurant',
            product: 'product',
            menu: 'menu',
            retail: 'shopping-cart'
        };

        vm.$onInit = function() {
            vm.activeIcon = icons[vm.value] || 'shopping-cart';
            vm.ratingLabel = vm.label || '';
        };
    }
})();