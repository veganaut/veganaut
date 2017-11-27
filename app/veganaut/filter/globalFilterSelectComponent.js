(function() {
    'use strict';

    angular
        .module('veganaut.app.filter')
        .component('vgGlobalFilterSelect', globalFilterSelectComponent());

    function globalFilterSelectComponent() {
        var component = {
            bindings: {
                filterName: '<vgFilterName'
            },
            controller: GlobalFilterSelectController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/filter/globalFilterSelectComponent.html'
        };

        return component;
    }

    GlobalFilterSelectController.$inject = [];

    function GlobalFilterSelectController() {
        var $ctrl = this;

        $ctrl.icons = {
            before: '',
            after: ''
        };

        $ctrl.$onInit = function() {
            switch ($ctrl.filterName) {
            case 'veganLevel':
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
    }
})();
