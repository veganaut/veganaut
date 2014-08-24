(function(module) {
    'use strict';
    module.factory('locationService', ['$q', 'Location', 'tileLayerUrl', 'backendService',
        function($q, Location, tileLayerUrl, backendService) {
            var LocationService = function() {
                this._deferredLocations = $q.defer();

                /**
                 * Main map settings:
                 *  - current center of the map
                 *  - leaflet "defaults" settings
                 * TODO: does this belong in the service?
                 * @type {{}}
                 */
                this.mapSettings = {
                    center: {
                        lat: 46.949,
                        lng: 7.451,
                        zoom: 14
                    },
                    defaults: {
                        tileLayer: tileLayerUrl
                    }
                };

                /**
                 * The currently active location
                 * @type {Location}
                 */
                this.active = undefined;
            };

            LocationService.prototype.getLocations = function() {
                var that = this;
                backendService.getLocations()
                    .then(function(data) {
                        var locations = [];
                        for (var i = 0; i < data.data.length; i++) {
                            locations.push(Location.fromJson(data.data[i]));
                        }
                        that._deferredLocations.resolve(locations);
                    })
                ;
                return this._deferredLocations.promise;
            };

            /**
             * Sets the given location as active deactivates it if it's already active.
             * @param {Location} [location]
             */
            LocationService.prototype.activate = function(location) {
                // Deactivate current location
                if (typeof this.active !== 'undefined') {
                    this.active.setActive(false);
                }

                if (this.active === location || typeof location === 'undefined') {
                    // If the given location is already active
                    // or the new active location should be undefined, deactivate
                    this.active = undefined;
                }
                else {
                    // Otherwise activate the given location
                    this.active = location;
                    this.active.setActive();
                }
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
