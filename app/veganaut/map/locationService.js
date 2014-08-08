(function(servicesModule) {
    'use strict';
    servicesModule.factory('locationService', ['$q', 'Location', 'tileLayerUrl', function($q, Location, tileLayerUrl) {
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

        return new LocationService();
    }]);
})(window.monkeyFace.servicesModule);
