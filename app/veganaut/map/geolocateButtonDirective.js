(function(module) {
    'use strict';

    /**
     * Maz zoom to be used when a location was found
     * @type {number}
     */
    var MAX_GEOLOCATE_ZOOM = 17;

    /**
     * Directive for adding a geolocate button to a map.
     * When clicked, it uses the browser's geolocation API to retrieve a location.
     */
    module.directive('vgGeolocateButton', function() {
        return {
            restrict: 'E',
            scope: {},
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
                    this.supported = !!($window.navigator.geolocation);

                    /**
                     * Whether we are currently locating
                     * @type {boolean}
                     */
                    this.locating = false;

                    /**
                     * Reference to the map object
                     * @type {{}}
                     */
                    this._map = undefined;

                    /**
                     * Use the geolocation API to locate the user and move the map to that place
                     * @param $event
                     */
                    this.locate = function($event) {
                        if (!this.supported || !this._map) {
                            return;
                        }

                        // Use the leaflet locate method
                        this._map.locate();

                        // Start locating
                        this.locating = true;

                        // Blur the button
                        $event.target.blur();

                        // Track usage
                        angularPiwik.track('map.geolocation', 'start');
                    };

                    /**
                     * Handles the returned location from leaflet locationfound event
                     * @param location
                     * @private
                     */
                    this._onLocationFound = function(location) {
                        // Done locating
                        this.locating = false;

                        // Fit the map to the bounds
                        this._map.fitBounds(location.bounds, {
                            maxZoom: MAX_GEOLOCATE_ZOOM
                        });

                        // Apply after timeout (otherwise the map center is not always correctly updated)
                        $timeout(function() {
                            $scope.$apply();
                        }, 0);

                        // After a while (when zooming/panning is done) add a circle to show the accuracy
                        // TODO: actually wait for the zooming to be done
                        $timeout(function() {
                            var radius = location.accuracy / 2;
                            var marker = L.circle(location.latlng, radius, {
                                className: 'geolocate-circle-marker'
                            });

                            marker.addTo(this._map);

                            // Remove it again after it's faded out
                            $timeout(function() {
                                this._map.removeLayer(marker);
                            }.bind(this), 2000); // TODO: move numbers to constant
                        }.bind(this), 300);

                        // Track usage
                        angularPiwik.track('map.geolocation', 'found');
                    };

                    /**
                     * Handles the leaflet locationerror event
                     * @private
                     */
                    this._onLocationError = function() {
                        // Done locating
                        this.locating = false;

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
