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
            controller: ['$scope', 'locationService', function($scope, locationService) {
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

                function compileList(locations) {
                    vm.list = _.chain(locations)
                        .filter(function(loc) {
                            return !loc.isDisabled();
                        })
                        .sortByOrder(['quality.average', 'name'], ['desc', 'asc'])
                        .value();
                }

                $scope.$watchCollection('locationListVm._locations', compileList);

                var bounds = '7.41474151611328,46.92084154916144,7.469673156738281,46.982594624734936';
                locationService.getLocations(bounds).then(compileList);

            }],
            controllerAs: 'locationListVm',
            bindToController: true,
            templateUrl: '/veganaut/location/vgLocationList.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgLocationList', [locationListDirective]);
})(window.veganaut.locationModule);
