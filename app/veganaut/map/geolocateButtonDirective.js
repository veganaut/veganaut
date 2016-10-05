(function(module) {
    'use strict';

    /**
     * Maz zoom to be used when a location was found
     * @type {number}
     */
    var MAX_GEOLOCATE_ZOOM = 17;

    /**
     * Minimum radius of the circle marker that shows the location
     * @type {number}
     */
    var MIN_MARKER_RADIUS = 5;

    /**
     * Directive for adding a geolocate button to a map.
     * When clicked, it uses the browser's geolocation API to retrieve and watch
     * the user's location.
     */
    module.directive('vgGeolocateButton', function() {
        return {
            restrict: 'E',
            scope: {
                /**
                 * Leaflet map object.
                 */
                map: '=vgMap'
            },
            link: function(scope, element, attrs, vm) {
                element.on('$destroy', function() {
                    // Stop locating when destroyed
                    vm.stopLocate();

                    // And stop listening for events
                    vm.map.off('locationfound', vm._onLocationFound);
                    vm.map.off('locationerror', vm._onLocationError);
                });
            },
            controller: [
                '$scope', '$window', '$timeout', '$translate',
                'Leaflet', 'angularPiwik', 'alertService',
                function($scope, $window, $timeout, $translate,
                    L, angularPiwik, alertService)
                {
                    var vm = this;

                    /**
                     * Stores whether the browser supports geolocation
                     * @type {boolean}
                     */
                    vm.supported = !!('geolocation' in $window.navigator);

                    /**
                     * Whether we are currently waiting for the first coordinates
                     * @type {boolean}
                     */
                    vm.initialLocate = false;

                    /**
                     * Whether we are currently listening for location changes
                     * @type {boolean}
                     */
                    vm.active = false;

                    /**
                     * Leaflet circle instance used to show the coordinates and accuracy on the map
                     * @type {L.circle}
                     * @private
                     */
                    vm._marker = undefined;

                    /**
                     * Handler for clicks on the locate button.
                     * Use the geolocation API to locate the user and move the map to that place.
                     * @param $event
                     */
                    vm.onClick = function($event) {
                        if (!vm.supported) {
                            return;
                        }

                        // Check if we are already active
                        if (vm.active) {
                            vm.stopLocate();
                        }
                        else {
                            // Start locating and set to active
                            vm.initialLocate = true;
                            vm.active = true;

                            // Use the leaflet locate method
                            vm.map.locate({
                                watch: true
                            });

                            // Track usage
                            angularPiwik.track('map.geolocation', 'start');
                        }

                        // Blur the button
                        $event.target.blur();
                    };

                    /**
                     * Stops the locating and resets everything correctly.
                     */
                    vm.stopLocate = function() {
                        // Check if we are actually active
                        if (vm.active) {
                            // Reset flags
                            vm.initialLocate = false;
                            vm.active = false;

                            // Stop locating
                            vm.map.stopLocate();

                            // Remove the marker
                            if (angular.isDefined(vm._marker)) {
                                vm.map.removeLayer(vm._marker);
                                vm._marker = undefined;
                            }
                        }
                    };

                    /**
                     * Handles the returned location from leaflet locationfound event
                     * @param location
                     * @private
                     */
                    vm._onLocationFound = function(location) {
                        // Coming directly from leaflet, need $apply
                        $scope.$apply(function() {
                            // Check if this is the first location found
                            if (vm.initialLocate) {
                                // Initial locating done
                                vm.initialLocate = false;

                                // Fit the map to the bounds
                                vm.map.fitBounds(location.bounds, {
                                    maxZoom: MAX_GEOLOCATE_ZOOM
                                });

                                // Apply after timeout (otherwise the map center is not always correctly updated)
                                $timeout(function() {
                                    $scope.$apply();
                                }, 0);

                                // After a while (when zooming/panning is done) call locatin update
                                // TODO: actually wait for the zooming to be done
                                $timeout(function() {
                                    vm._onLocationUpdate(location);
                                }.bind(this), 300);

                                // Track usage
                                angularPiwik.track('map.geolocation', 'found');
                            }
                            else {
                                // Location was already found before, this is just an update
                                vm._onLocationUpdate(location);
                            }
                        });
                    };

                    /**
                     * Adds or updates the circle marker showing the current location on the map
                     * @param location
                     * @private
                     */
                    vm._onLocationUpdate = function(location) {
                        var radius = Math.max(location.accuracy / 2, MIN_MARKER_RADIUS);

                        if (angular.isUndefined(vm._marker)) {
                            vm._marker = L.circle(location.latlng, radius, {
                                className: 'geolocate-circle-marker'
                            });

                            vm._marker.addTo(vm.map);
                        }
                        else {
                            vm._marker.setLatLng(location.latlng);
                            vm._marker.setRadius(radius);
                        }
                    };

                    /**
                     * Handles the leaflet locationerror event
                     * @private
                     */
                    vm._onLocationError = function() {
                        // Coming directly from leaflet, need $apply
                        $scope.$apply(function() {
                            // Done locating
                            vm.stopLocate();

                            // Tell user about error
                            alertService.addAlert($translate.instant('message.geolocate.error'), 'danger');

                            // Track usage
                            angularPiwik.track('map.geolocation', 'error');
                        });
                    };


                    // Listen to location events
                    vm.map.on('locationfound', vm._onLocationFound);
                    vm.map.on('locationerror', vm._onLocationError);
                }
            ],
            controllerAs: 'geolocateButton',
            bindToController: true,
            templateUrl: '/veganaut/map/geolocateButton.tpl.html'
        };
    });
})(window.veganaut.mapModule);
