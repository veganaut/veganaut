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
        'backendService',
        'locationFilterService',
        'locationService'
    ];

    function ListController(backendService, locationFilterService, locationService) {
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

        locationFilterService.setFiltersFromUrl();
        $ctrl.selectedType = locationFilterService.activeFilters.type;

        $ctrl.$onInit = function() {
            switch (locationFilterService.activeFilters.type) {
            case 'gastronomy':
                $ctrl.listName = 'locationList';
                $ctrl.onOpenToggle = locationService.loadFullLocation;
                $ctrl.onLoadItems = function(lat, lng, radius, limit, skip, addressType) {
                    return locationService.getLocationsByRadius(lat, lng, radius, limit, skip, addressType)
                        .then(function(data) {
                            return {
                                totalItems: data.totalLocations,
                                items: data.locations
                            };
                        });
                };
                break;
            case 'retail':
                $ctrl.listName = 'locationList';
                $ctrl.onOpenToggle = locationService.loadFullLocation;
                $ctrl.onLoadItems = function(lat, lng, radius, limit, skip, addressType) {
                    return locationService.getLocationsByRadius(lat, lng, radius, limit, skip, addressType)
                        .then(function(data) {
                            return {
                                totalItems: data.totalLocations,
                                items: data.locations
                            };
                        });
                };
                break;
            case 'meals':
                $ctrl.listName = 'productList';
                // $ctrl.onOpenToggle =
                $ctrl.onLoadItems = function(lat, lng, radius, limit, skip) {
                    return backendService.getProducts(
                        lat, lng, radius,
                        locationFilterService.getTypeFilterValue(),
                        skip, limit
                    ).then(function(res) {
                        return {
                            totalItems: res.data.totalProducts,
                            items: res.data.products
                        };
                    });
                };
                break;
            case 'products':
                $ctrl.listName = 'productList';
                // $ctrl.onOpenToggle =
                $ctrl.onLoadItems = function(lat, lng, radius, limit, skip) {
                    return backendService.getProducts(
                        lat, lng, radius,
                        locationFilterService.getTypeFilterValue(),
                        skip, limit
                    ).then(function(res) {
                        return {
                            totalItems: res.data.totalProducts,
                            items: res.data.products
                        };
                    });
                };
                break;
            default:
                // If no type set, switch to gastronomy by default
                $ctrl.setTypeFilter('gastronomy');
                // This makes the component to be loaded twice. TODO: Find a better way to do it.
                break;
            }
        };

        $ctrl.setTypeFilter = function(type) {
            $ctrl.selectedType = type;
            locationFilterService.activeFilters.type = type;
            locationFilterService.onFiltersChanged();
        };
    }
})();
