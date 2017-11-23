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

        $ctrl.listName = 'restaurant';

        locationFilterService.setFiltersFromUrl();
        $ctrl.selectedGroup = locationFilterService.activeFilters.group;

        $ctrl.$onInit = function() {

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

        $ctrl.onCategoryChange = function(listName) {
            $ctrl.listName = listName;
        };

    }
})();
