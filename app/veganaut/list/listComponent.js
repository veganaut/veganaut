(function() {
    'use strict';

    angular
        .module('veganaut.app.main')
        .component('vgList', listComponent());

    function listComponent() {
        var component = {
            bindings: {},
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

        $ctrl.onOpenToggle = function() {
            // Only need to do something when showing locations
            if (locationFilterService.getGranularityFilterValue() === 'location') {
                locationService.loadFullLocation();
            }
        };

        $ctrl.onLoadItems = function(lat, lng, radius, limit, skip, addressType) {
            switch (locationFilterService.getGranularityFilterValue()) {
            case 'location':
                return locationService
                    .getLocationsByRadius(lat, lng, radius, limit, skip, addressType)
                    .then(function(data) {
                        return {
                            totalItems: data.totalLocations,
                            items: data.locations
                        };
                    });
            case 'product':
                return backendService
                    .getProducts(
                        lat, lng, radius,
                        locationFilterService.getTypeFilterValue(),
                        skip, limit
                    )
                    .then(function(res) {
                        return {
                            totalItems: res.data.totalProducts,
                            items: res.data.products
                        };
                    });
            default:
                // Should not happen
                break;
            }
        };
    }
})();
