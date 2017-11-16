(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgQualityIndicator', qualityIndicatorComponent());

    function qualityIndicatorComponent() {
        var component = {
            bindings: {
                value: '<vgValue',
                label: '<?vgLabel',
                labelVisible: '<?vglabelVisible'
            },
            controller: QualityIndicatorComponentController,
            controllerAs: 'vm',
            templateUrl: 'components/ui/qualityIndicator/qualityIndicatorComponent.html'
        };

        return component;
    }

    // Inject dependencies
    // QualityIndicatorComponentController.$inject = ['$translate'];

    function QualityIndicatorComponentController() {
        var vm = this;

        vm.activeIcon = null;
        vm.ratingLabel = '';

        var icons = [
            'veganlevel-1',
            'veganlevel-2',
            'veganlevel-3',
            'veganlevel-4',
            'veganlevel-5'
        ];

        vm.$onInit = function() {
            var intValue = parseInt(vm.value);
            if(intValue && intValue >= 0) {
                vm.activeIcon = icons[intValue - 1];
                vm.ratingLabel = vm.label || '';
            }
        };
    }
})();