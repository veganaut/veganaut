(function() {
    'use strict';

    angular
        .module('veganaut.app.main')
        .component('vgList', listComponent());

    function listComponent() {
        var component = {
            bindings: {
            },
            controller: ListController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/list/listComponent.html'
        };

        return component;
    }

    ListController.$inject = [
        '$routeParams',
        'locationFilterService'
    ];

    function ListController($routeParams, locationFilterService) {
        var $ctrl = this;

        $ctrl.typeFilters = [
            [
                'gastronomy',
                'meals'
            ],
            [
                'retail',
                'products'
            ]
        ];

        $ctrl.selectedType = $routeParams.type;

        $ctrl.$onInit = function() {
        };

        $ctrl.setTypeFilter = function(type) {
            locationFilterService.activeFilters.type = type;
            locationFilterService.onFiltersChanged();
        };
    }
})();
