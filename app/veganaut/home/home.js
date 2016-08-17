(function() {
    'use strict';

    /**
     * Component for the home page.
     * @returns {directive}
     */
    var homeDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgHomeCtrl',
            controllerAs: 'homeVm',
            bindToController: true,
            templateUrl: '/veganaut/home/home.tpl.html'
        };
    };

    var homeCtrl = [
        '$scope', '$location', 'backendService', 'mainMapService',
        function($scope, $location, backendService, mainMapService) {
            var vm = this;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            vm.legacyGlobals = {
                goToView: $scope.$parent.goToView,
                isLoggedIn: $scope.$parent.isLoggedIn
            };

            // TODO WIP: finalise the new start page
            vm.countryName = undefined;
            vm.form = {
                ctaInput: ''
            };

            var targetPlace;

            vm.goToMap = function() {
                mainMapService.setTargetPlace(targetPlace);
                $location.path('map');
            };

            vm.getUserLocation = function() {
                navigator.geolocation.getCurrentPosition(function(position) {
                    console.log(position);
                    targetPlace = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        zoom: 15 // TODO WIP: what to use?
                    };
                    $scope.$apply(function() {
                        vm.form.ctaInput = 'My location';
                    });
                }, function(error) {
                    // TODO WIP: show error to user
                    console.error(error);
                }, {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0
                });
            };

            // TODO WIP: only do that if not already located (local storage?)
            backendService.getGeoIP().then(function(res) {
                var data = res.data;
                console.log(data);

                if (_.isObject(data)) {
                    vm.countryName = data.countryName;
                    vm.form.ctaInput = vm.countryName;

                    targetPlace = {
                        lat: data.lat,
                        lng: data.lng,
                        boundingBox: data.boundingBox
                    };
                }
                // else {
                    // TODO WIP
                // }

            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.home')
        .controller('vgHomeCtrl', homeCtrl)
        .directive('vgHome', [homeDirective])
    ;
})();
