(function(module) {
    'use strict';
    module.factory('mainMapService', [
        '$window', '$location', 'backendService',
        function($window, $location, backendService) {
            /**
             * Default zoom used when no one provided a zoom level
             * @type {number}
             */
            var DEFAULT_ZOOM = 2;

            /**
             * Zoom level used when the backend provides the zoom level
             * based on the IP address
             * @type {number}
             */
            var GEO_IP_ZOOM = 10;

            /**
             * Local storage id used for storing the current map center
             * @type {string}
             */
            var MAP_CENTER_STORAGE_ID = 'veganautMapCenter';

            /**
             * Service managing the main map. This mostly concerns the
             * storage and retrieval of the map center from different sources.
             * @constructor
             */
            var MainMapService = function() {
                /**
                 * Current center of the map
                 * @type {{lat: number, lng: number, zoom: number}}
                 */
                this.center = {
                    lat: 0,
                    lng: 0,
                    zoom: DEFAULT_ZOOM
                };

                this._initialiseMapCenter();
            };

            /**
             * Sets the map center either from the url hash, local storage or
             * from asking the backend for a location
             * @private
             */
            MainMapService.prototype._initialiseMapCenter = function() {
                var that = this;

                // Try setting from the URL hash
                var centerSet = that.setMapCenterFromUrl();

                // Try to load from center from local storage
                if (!centerSet) {
                    centerSet = that._setMapCenterFromLocalStorage();
                }

                // Finally, ask the backend for a center
                if (!centerSet) {
                    backendService.getGeoIP().then(function(res) {
                        // Try to set the received center
                        that._setMapCenterIfValid(res.data.lat, res.data.lng, GEO_IP_ZOOM);
                    });
                }
            };

            /**
             * Checks if the given center and zoom coordinates are valid
             * and sets them if they are.
             * @param {number} lat
             * @param {number} lng
             * @param {number} zoom
             * @returns {boolean} Whether the center was set
             * @private
             */
            MainMapService.prototype._setMapCenterIfValid = function(lat, lng, zoom) {
                if (angular.isNumber(lat) && isFinite(lat) &&
                    angular.isNumber(lng) && isFinite(lat) &&
                    angular.isNumber(zoom) && isFinite(lat))
                {
                    this.center.lat = lat;
                    this.center.lng = lng;
                    this.center.zoom = zoom;

                    this.saveCenter();
                    return true;
                }
                return false;
            };

            /**
             * Try to read the map center from local storage
             * @returns {boolean} Whether the center was set
             * @private
             */
            MainMapService.prototype._setMapCenterFromLocalStorage = function() {
                var center = JSON.parse($window.localStorage.getItem(MAP_CENTER_STORAGE_ID) || '{}');
                return this._setMapCenterIfValid(center.lat, center.lng, center.zoom);
            };

            /**
             * Try to read the map center from the url hash
             * @returns {boolean} Whether the center was set
             */
            MainMapService.prototype.setMapCenterFromUrl = function() {
                // Hash is in the form: zoom:11,coords:46.9767388-7.6516342
                var hashArgs = $location.hash().split(',');
                var zoom, lat, lng;

                // Go through all the arguments
                for (var i = 0; i < hashArgs.length; i++) {
                    var arg = hashArgs[i].split(':');
                    if (arg[0] === 'zoom') {
                        // Found zoom value
                        zoom = parseInt(arg[1], 10);
                    }
                    else if (arg[0] === 'coords') {
                        // Found coordinates
                        var coords = arg[1].split('-');
                        if (coords.length === 2) {
                            lat = parseFloat(coords[0]);
                            lng = parseFloat(coords[1]);
                        }
                    }
                }

                return this._setMapCenterIfValid(lat, lng, zoom);
            };

            /**
             * Saves the map center in local storage and in the url
             */
            MainMapService.prototype.saveCenter = function() {
                // Store it in local storage
                $window.localStorage.setItem(MAP_CENTER_STORAGE_ID,
                    JSON.stringify(this.center)
                );

                // Store it in the url hash (without adding a new history item)
                $location.replace();
                $location.hash(
                    'zoom:' +
                    this.center.zoom +
                    ',coords:' +
                    this.center.lat.toFixed(7) + '-' +
                    this.center.lng.toFixed(7)
                );
            };

            return new MainMapService();
        }
    ]);
})(window.veganaut.mapModule);
