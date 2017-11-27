(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgSortToggle', sortToggleComponent());

    function sortToggleComponent() {
        var component = {
            bindings: {
                name: '<vgName',
                active: '<vgActive',
                onChange: '&vgOnChange'
            },
            controller: SortToggleController,
            controllerAs: '$ctrl',
            templateUrl: '/components/ui/sortToggle/sortToggleComponent.html'
        };

        return component;
    }

    SortToggleController.$inject = [];

    function SortToggleController() {
        var $ctrl = this;

        $ctrl.icons = {
            before: '',
            after: ''
        };

        $ctrl.$onInit = function() {
            switch ($ctrl.name) {
            case 'quality':
                $ctrl.icons.before = 'veganlevel-5';
                $ctrl.icons.after = 'veganlevel-1';
                break;
            case 'distance':
                $ctrl.icons.before = 'location';
                $ctrl.icons.after = 'route';
                break;
            case 'lastUpdate':
                $ctrl.icons.before = 'clock';
                $ctrl.icons.after = 'calendar';
                break;
            }
        };

        $ctrl.toggle = function() {
            $ctrl.active = !$ctrl.active;
            $ctrl.onChange({active: $ctrl.active});
        };
    }
})();
