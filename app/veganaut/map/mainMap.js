(function() {
    'use strict';

    /**
     * Component for the main map page.
     * Holds the map and all the actions possible on the map.
     * @returns {directive}
     */
    var mainMapDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgMainMapCtrl',
            controllerAs: 'mainMapVm',
            bindToController: true,
            link: function(scope, el, attrs, vm) {
                // Remove map on destroy. This clears all Leaflet event listeners properly.
                scope.$on('$destroy', function() {
                    vm.map.remove();
                });
            },
            templateUrl: '/veganaut/map/mainMap.tpl.html'
        };
    };

    // TODO: re-group variable and method definition
    // TODO: the main map should just do without angular-leaflet, it's hardly using it anymore
    var mainMapCtrl = [
        '$scope', '$location', '$route', '$uibModal', 'Leaflet', 'angularPiwik', 'mapDefaults', 'constants',
        'playerService', 'locationService', 'locationFilterService', 'mainMapService',
        function($scope, $location, $route, $uibModal, L, angularPiwik, mapDefaults, constants,
            playerService, locationService, locationFilterService, mainMapService)
        {
            var vm = this;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            vm.legacyGlobals = {
                goToView: $scope.$parent.goToView,
                isLoggedIn: $scope.$parent.isLoggedIn,
                isEmbedded: $scope.$parent.isEmbedded
            };

            /**
             * Locations loaded from the backend
             * @type {LocationSet}
             */
            vm.locationSet = locationService.getLocationSet();

            /**
             * Whether to show the location products
             * @type {boolean}
             */
            vm.productShown = false;

            // Parse legacy URL and redirect if anything found
            // TODO: Remove this after a few month of having the new URL scheme
            var hash = $location.hash();
            var legacyParams = {};
            if (hash.length > 0) {
                var hashArgs = hash.split(',');
                _.each(hashArgs, function(arg) {
                    var split = arg.split(':');
                    if (split.length === 2 && ['zoom', 'coords', 'type'].indexOf(split[0]) > -1) {
                        if (split[0] === 'coords') {
                            // Convert coords from being separated by "-" to ","
                            var match = /(-?[0-9\.]+)-(-?[0-9\.]+)/.exec(split[1]);
                            if (match) {
                                split[1] = match[1] + ',' + match[2];
                            }
                        }
                        legacyParams[split[0]] = split[1];
                    }
                });
            }
            if (Object.keys(legacyParams).length > 0) {
                // Replace the URL (no new history entry) and delete hash
                $location
                    .replace()
                    .hash(null)
                ;

                // Set new route params and make sure the route is reloaded
                $route.updateParams(legacyParams);
                $route.reload();

                // Nothing else to be done here, we are redirecting
                return;
            }

            /**
             * Leaflet map object
             * @type {{}}
             */
            vm.map = L.map('mainMap', {
                layers: [
                    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })
                ],
                worldCopyJump: true
            });
            vm.map.zoomControl.setPosition('bottomleft');

            /**
             * Whether to show the 'city' or the 'street' part of the address.
             * Depends on the zoom level.
             * @type {string}
             */
            vm.addressType = undefined;

            /**
             * Method to inform service that the center changed
             */
            var informCenterChanged = function() {
                var newCenter = vm.map.getCenter();
                var zoom = vm.map.getZoom();

                // Check whether to show the city or street part of the address
                vm.addressType = (zoom > constants.ADDRESS_TYPE_BOUNDARY_ZOOM ? 'street' : 'city');

                mainMapService.onCenterChanged({
                    lat: newCenter.lat,
                    lng: newCenter.lng,
                    zoom: zoom,
                    boundingBox: vm.map.getBounds()
                });
            };

            // Get the player
            var playerPromise = playerService.getDeferredMe();

            /**
             * Sets whether the product list is shown
             * @param {boolean} [show=true]
             */
            vm.showProductList = function(show) {
                if (typeof show === 'undefined') {
                    show = true;
                }
                show = !!show;

                // Update and track if it changed
                if (vm.productShown !== show) {
                    vm.productShown = show;
                    angularPiwik.track('map.products', 'map.products.' + (show ? 'show' : 'hide'));
                }
            };

            /**
             * Starts creating a new location
             */
            vm.startCreateLocation = function() {
                playerPromise.then(function(player) {
                    vm.locationSet.startCreateLocation(player, vm.map);
                });
            };

            /**
             * Temporary handler of the what's new test
             */
            vm.openWhatsNew = function() {
                angularPiwik.track('test.whatsNew', 'test.whatsNew.click');
                $uibModal.open({
                    template: '<p>{{ "missingFeature.whatsNew" | translate }}</p>' +
                    '<p><button class="btn btn-default btn-block" ng-click="modalVm.close()">' +
                    '{{ "missingFeature.button" | translate }}</button></p>',
                    controller: ['$modalInstance', function($modalInstance) {
                        var vm = this;
                        vm.close = function() {
                            $modalInstance.close();
                        };
                    }],
                    controllerAs: 'modalVm',
                    bindToController: true
                });
            };

            /**
             * Temporary handler of the rate test
             */
            vm.openRate = function() {
                angularPiwik.track('test.unregisteredRate', 'test.unregisteredRate.click');
                $uibModal.open({
                    template: '<p>{{ "missingFeature.rate" | translate }}' +
                    '<a href="/register">' +
                    '{{ "missingFeature.rateLink" | translate }}</a>.</p>' +
                    '<p><button class="btn btn-default btn-block" ng-click="modalVm.close()">' +
                    '{{ "missingFeature.button" | translate }}</button></p>',
                    controller: ['$modalInstance', function($modalInstance) {
                        var vm = this;
                        vm.close = function() {
                            $modalInstance.close();
                        };
                    }],
                    controllerAs: 'modalVm',
                    bindToController: true
                });
            };

            /**
             * Returns the location type to be shown on the product list
             * @returns {string}
             */
            vm.getProductListType = function() {
                // Default is gastronomy
                var type = 'gastronomy';

                // If filter is set to retail, then retail
                if (locationFilterService.activeFilters.type === 'retail') {
                    type = 'retail';
                }

                return type;
            };

            /**
             * Handler for clicks on map markers. This will only ever be called for
             * Locations, because only those are clickable (clusters aren't).
             * @param {Location} locationItem
             */
            vm.onLocationClick = function(locationItem) {
                if (!vm.locationSet.isCreatingLocation() && !locationItem.isDisabled()) {
                    // Run it through $apply since we are coming directly from Leaflet
                    $scope.$apply(function() {
                        vm.locationSet.activate(locationItem);

                        // Track it
                        angularPiwik.track('map.locations', 'map.locations.click');

                        // Hide the product list
                        vm.showProductList(false);
                    });
                }
                // TODO: if not handled, should pass on the click to the map?
            };

            // Register to map changes
            // We do it directly through leaflet, because watching the center
            // provided from leaflet-directive is buggy in some cases.
            vm.map.on('moveend', informCenterChanged);
            vm.map.on('viewreset', informCenterChanged);

            // Listen to clicks on the map
            vm.map.on('click', function() {
                $scope.$apply(function() {
                    if (!vm.locationSet.isCreatingLocation()) {
                        // When not adding a location, deselect currently active location
                        vm.locationSet.activate();

                        // And hide product list
                        vm.showProductList(false);
                    }
                });
            });

            // Listen to explicit area changes
            $scope.$on('veganaut.area.pushToMap', function() {
                mainMapService.showCurrentArea(vm.map);
            });

            // When we go away from this page, abort adding location
            $scope.$on('$routeChangeStart', function(event) {
                if (!event.defaultPrevented) {
                    vm.locationSet.abortCreateLocation();
                }
            });

            // Finally, initialise the map
            mainMapService.initialiseMap(vm.map);
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.map')
        .controller('vgMainMapCtrl', mainMapCtrl)
        .directive('vgMainMap', [mainMapDirective])
    ;
})();
