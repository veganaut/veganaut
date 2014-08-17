(function(module) {
    'use strict';
    module.factory('locationService', ['$q', 'Location', 'tileLayerUrl', function($q, Location, tileLayerUrl) {
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
            // TODO: request from backend
            this._deferredLocations.resolve([
                new Location(46.957113, 7.452544, 'blue',  '3dosha', Location.TYPES.gastronomy),
                new Location(46.946757, 7.441016, 'blue',  'Reformhaus Ruprecht', Location.TYPES.retail),
                new Location(46.953880, 7.446611, 'green', 'Kremoby Hollow', Location.TYPES.private),
                new Location(46.952254, 7.445619, 'green', 'Habakuk im Fleuri', Location.TYPES.event)
            ]);
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
    }]);
})(window.veganaut.mapModule);
