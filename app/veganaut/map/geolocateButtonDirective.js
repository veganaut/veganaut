(function(module) {
    'use strict';

    var GEOLOCATE_ZOOM = 17;


    /**
     * Directive for adding a geolocate button to a map.
     * When clicked, it uses the browser's geolocation API to retrieve
     * a location and move the map to that place.
     */
    module.directive('vgGeolocateButton', function() {
        return {
            restrict: 'E',
            scope: {
                _center: '=vgMapCenter'
            },
            controller: ['$window', function($window) {
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
                 * Use the geolocation API to locate the user and move the map to that place
                 * @param $event
                 */
                this.locate = function($event) {
                    if (!this.supported) {
                        // Should never happen, ui should not be rendered
                        return;
                    }

                    // Start locating
                    this.locating = true;
                    $window.navigator.geolocation.getCurrentPosition(this._handleLocation.bind(this));
                    // TODO: can one handle when access to location is denied or there is another error?

                    // Blur the button
                    $event.target.blur();
                };

                /**
                 * Handles the returned location from the geolocation API
                 * @param loc
                 * @private
                 */
                this._handleLocation = function(loc) {
                    // Set the center from the received location
                    // TODO: use accuracy to zoom
                    this._center.zoom = GEOLOCATE_ZOOM;
                    this._center.lat = loc.coords.latitude;
                    this._center.lng = loc.coords.longitude;

                    // Done locating
                    this.locating = false;
                };
            }],
            controllerAs: 'geolocateButton',
            bindToController: true,
            templateUrl: '/veganaut/map/geolocateButton.tpl.html'
        };
    });
})(window.veganaut.mapModule);
