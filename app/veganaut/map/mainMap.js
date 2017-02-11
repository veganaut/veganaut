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

    var mainMapCtrl = [
        '$scope', 'Leaflet', 'angularPiwik', 'mapDefaults', 'constants',
        'playerService', 'locationService', 'locationFilterService', 'mainMapService',
        function($scope, L, angularPiwik, mapDefaults, constants,
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

            /**
             * Leaflet map object
             * @type {{}}
             */
            vm.map = L.map('mainMap', _.defaults({
                // TODO: move the layer definition also to the config
                layers: [
                    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })
                ]
            }, mapDefaults));
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
            $scope.$on('veganaut.area.changed', function() {
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
