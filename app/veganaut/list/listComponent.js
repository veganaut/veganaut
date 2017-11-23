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
            'gastronomy',
            'retail'
        ];

        $ctrl.groupFilters = [
            'location',
            'product'
        ];

        $ctrl.listNames = {
            gastronomy: {
                location: 'restaurant',
                product: 'meal'
            },
            retail: {
                location: 'shop',
                product: 'retailProduct'
            }
        };

        locationFilterService.setFiltersFromUrl();
        $ctrl.selectedType = locationFilterService.activeFilters.type;
        $ctrl.selectedGroup = locationFilterService.activeFilters.group;

        $ctrl.$onInit = function() {
            if ($ctrl.typeFilters.indexOf(locationFilterService.activeFilters.type) === -1 ||
                $ctrl.groupFilters.indexOf(locationFilterService.activeFilters.group) === -1) {
                // If no type or group set, switch to restaurant by default
                $ctrl.setFilter('gastronomy', 'location');
                // This makes the component to be loaded twice. TODO: Find a better way to do it.
            }

            $ctrl.listName = $ctrl.listNames[locationFilterService.activeFilters.type][locationFilterService.activeFilters.group];

            switch (locationFilterService.activeFilters.group) {
            case 'location':
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
            case 'product':
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
                // Should not happen because of check at the beginning of $onInit().
                break;
            }
        };

        $ctrl.setFilter = function(type, group) {
            $ctrl.selectedType = type;
            $ctrl.selectedGroup = group;
            locationFilterService.activeFilters.type = type;
            locationFilterService.activeFilters.group = group;
            locationFilterService.onFiltersChanged();
        };
    }
})();
