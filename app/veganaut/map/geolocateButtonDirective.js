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
            scope: {},
            link: function(scope, element, attrs, vm) {
                // Stop locating when destroyed
                element.on('$destroy', function() {
                    vm.stopLocate();
                });
            },
            controller: [
                '$scope', '$window', '$timeout', '$translate',
                'Leaflet', 'leafletData', 'angularPiwik', 'alertService',
                function($scope, $window, $timeout, $translate,
                    L, leafletData, angularPiwik, alertService)
                {
                    /**
                     * Stores whether the browser supports geolocation
                     * @type {boolean}
                     */
                    this.supported = !!('geolocation' in $window.navigator);

                    /**
                     * Whether we are currently waiting for the first coordinates
                     * @type {boolean}
                     */
                    this.initialLocate = false;

                    /**
                     * Whether we are currently listening for location changes
                     * @type {boolean}
                     */
                    this.active = false;

                    /**
                     * Reference to the map object
                     * @type {{}}
                     */
                    this._map = undefined;

                    /**
                     * Leaflet circle instance used to show the coordinates and accuracy on the map
                     * @type {L.circle}
                     * @private
                     */
                    this._marker = undefined;

                    /**
                     * Handler for clicks on the locate button.
                     * Use the geolocation API to locate the user and move the map to that place.
                     * @param $event
                     */
                    this.onClick = function($event) {
                        if (!this.supported || !this._map) {
                            return;
                        }

                        // Check if we are already active
                        if (this.active) {
                            this.stopLocate();
                        }
                        else {
                            // Start locating and set to active
                            this.initialLocate = true;
                            this.active = true;

                            // Use the leaflet locate method
                            this._map.locate({
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
                    this.stopLocate = function() {
                        // Check if we are actually active
                        if (this.active) {
                            // Reset flags
                            this.initialLocate = false;
                            this.active = false;

                            // Stop locating
                            this._map.stopLocate();

                            // Remove the marker
                            if (angular.isDefined(this._marker)) {
                                this._map.removeLayer(this._marker);
                                this._marker = undefined;
                            }
                        }
                    };

                    /**
                     * Handles the returned location from leaflet locationfound event
                     * @param location
                     * @private
                     */
                    this._onLocationFound = function(location) {
                        // Check if this is the first location found
                        if (this.initialLocate) {
                            // Initial locating done
                            this.initialLocate = false;

                            // Fit the map to the bounds
                            this._map.fitBounds(location.bounds, {
                                maxZoom: MAX_GEOLOCATE_ZOOM
                            });

                            // Apply after timeout (otherwise the map center is not always correctly updated)
                            $timeout(function() {
                                $scope.$apply();
                            }, 0);

                            // After a while (when zooming/panning is done) call locatin update
                            // TODO: actually wait for the zooming to be done
                            $timeout(function() {
                                this._onLocationUpdate(location);
                            }.bind(this), 300);

                            // Track usage
                            angularPiwik.track('map.geolocation', 'found');
                        }
                        else {
                            // Location was already found before, this is just an update
                            this._onLocationUpdate(location);
                        }
                    };

                    /**
                     * Adds or updates the circle marker showing the current location on the map
                     * @param location
                     * @private
                     */
                    this._onLocationUpdate = function(location) {
                        var radius = Math.max(location.accuracy / 2, MIN_MARKER_RADIUS);

                        if (angular.isUndefined(this._marker)) {
                            this._marker = L.circle(location.latlng, radius, {
                                className: 'geolocate-circle-marker'
                            });

                            this._marker.addTo(this._map);
                        }
                        else {
                            this._marker.setLatLng(location.latlng);
                            this._marker.setRadius(radius);
                        }
                    };

                    /**
                     * Handles the leaflet locationerror event
                     * @private
                     */
                    this._onLocationError = function() {
                        // Done locating
                        this.stopLocate();

                        // Tell user about error
                        alertService.addAlert($translate.instant('message.geolocate.error'), 'danger');

                        // Track usage
                        angularPiwik.track('map.geolocation', 'error');
                    };

                    // Retrieve the map
                    leafletData.getMap().then(function(map) {
                        this._map = map;

                        // Listen to location events
                        this._map.on('locationfound', this._onLocationFound.bind(this));
                        this._map.on('locationerror', this._onLocationError.bind(this));
                    }.bind(this));
                }
            ],
            controllerAs: 'geolocateButton',
            bindToController: true,
            templateUrl: '/veganaut/map/geolocateButton.tpl.html'
        };
    });
})(window.veganaut.mapModule);
