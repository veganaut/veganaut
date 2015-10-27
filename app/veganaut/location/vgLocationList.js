(function(module) {
    'use strict';

    /**
     * TODO
     * @returns {directive}
     */
    var locationListDirective = function() {
        return {
            restrict: 'E',
            scope: {
                _locations: '=vgLocations'
            },
            controller: ['$scope', '$location', 'locationService', function($scope, $location, locationService) {
                var vm = this;

                // TODO: document
                // TODO: make a directive for the actual list and open/closing

                vm.list = [];

                vm.openLocationId = undefined;

                vm.toggleOpen = function(location) {
                    if (vm.openLocationId === location.id) {
                        vm.openLocationId = undefined;
                        //angularPiwik.track('location.products', 'close');
                    }
                    else {
                        vm.openLocationId = location.id;
                        //angularPiwik.track('location.products', 'open');
                    }
                };

                // TODO: de-duplicate with MapCtrl
                vm.visitLocation = function(location) {
                    $location.path('location/' + location.id);
                };

                function compileList(locations) {
                    vm.list = _.chain(locations)
                        .filter(function(loc) {
                            return !loc.isDisabled();
                        })
                        .sortByOrder(['quality.average', 'quality.numRatings', 'name'], ['desc', 'desc', 'asc'])
                        // TODO: should sort by rank
                        .value();
                }

                $scope.$watchCollection('locationListVm._locations', compileList);


                // TODO: validate input from search params
                var query = $location.search();
                locationService.getLocationsByRadius(query.lat, query.lng, query.radius).then(compileList);

            }],
            controllerAs: 'locationListVm',
            bindToController: true,
            templateUrl: '/veganaut/location/vgLocationList.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgLocationList', [locationListDirective]);
})(window.veganaut.locationModule);
