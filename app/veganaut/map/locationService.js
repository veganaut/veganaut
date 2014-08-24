(function(module) {
    'use strict';
    module.factory('locationService', ['$q', 'Location', 'tileLayerUrl', 'backendService', function($q, Location, tileLayerUrl/*, backendService*/) {
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
            var data = [
                { id: 'a1', lat: 46.957113, lng: 7.452544, team: 'blue',  name: '3dosha', type: 'gastronomy' },
                { id: 'a2', lat: 46.946757, lng: 7.441016, team: 'blue',  name: 'Reformhaus Ruprecht', type: 'retail' },
                { id: 'a3', lat: 46.953880, lng: 7.446611, team: 'green', name: 'Kremoby Hollow', type: 'private' },
                { id: 'a4', lat: 46.952254, lng: 7.445619, team: 'green', name: 'Habakuk im Fleuri', type: 'event' }
            ];
            // TODO: request from backend
//            backendService.getLocations()
//                .then(function(data) {
            var locations = [];
            for (var i = 0; i < data.length; i++) {
                locations.push(Location.fromJson(data[i]));
            }
//                })
//            ;
            this._deferredLocations.resolve(locations);
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
