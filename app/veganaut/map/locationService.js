(function(servicesModule) {
    'use strict';
    servicesModule.factory('locationService', ['$q', 'Location', function($q, Location) {
        var LocationService = function() {
            this._deferredLocations = $q.defer();
        };

        LocationService.prototype.getLocations = function() {
            // TODO: request from backend
            this._deferredLocations.resolve([
                new Location(46.955, 7.451, 'blue',  'Some place', Location.TYPES.event),
                new Location(46.945, 7.456, 'blue',  'Some other place', Location.TYPES.gastronomy),
                new Location(46.95,  7.459, 'green','Great place', Location.TYPES.private),
                new Location(46.94,  7.44,  'green', 'Soon to be great place', Location.TYPES.retail)
            ]);
            return this._deferredLocations.promise;
        };

        return new LocationService();
    }]);
})(window.monkeyFace.servicesModule);
