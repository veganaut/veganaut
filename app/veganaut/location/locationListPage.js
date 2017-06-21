(function() {
    'use strict';

    /**
     * This components shows a list of locations. Which locations to show is
     * determined based on coordinates and a radius that are read from GET parameters.
     * @type {{}}
     */
    var locationListPageComponent = {
        controller: 'vgLocationListPageCtrl',
        templateUrl: '/veganaut/location/locationListPage.tpl.html'
    };

    var locationListPageCtrl = [
        'locationService',
        function(locationService) {
            var $ctrl = this;

            // Expose loading the full location from the service
            $ctrl.loadFullLocation = locationService.loadFullLocation;

            $ctrl.loadLocations = function(lat, lng, radius, limit, skip, addressType) {
                return locationService.getLocationsByRadius(lat, lng, radius, limit, skip, addressType)
                    .then(function(data) {
                        return {
                            totalItems: data.totalLocations,
                            items: data.locations
                        };
                    })
                ;
            };
        }
    ];

    // Expose as component
    angular.module('veganaut.app.location')
        .controller('vgLocationListPageCtrl', locationListPageCtrl)
        .component('vgLocationListPage', locationListPageComponent)
    ;
})();
