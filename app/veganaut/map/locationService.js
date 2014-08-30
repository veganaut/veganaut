(function(module) {
    'use strict';
    module.factory('locationService', ['$q', 'Location', 'tileLayerUrl', 'backendService', 'alertService',
        function($q, Location, tileLayerUrl, backendService, alertService) {
            var LocationService = function() {
                /**
                 * Deferred that stores the locations
                 * @type {Deferred}
                 * @private
                 */
                this._deferredLocations = undefined;

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
                        zoom: 13
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

            /**
             * Returns a Promise that will resolve to the locations
             * @returns {Promise}
             */
            LocationService.prototype.getLocations = function() {
                var that = this;
                that._deferredLocations = $q.defer();
                var beforeActive = this.active;
                this.active = undefined;
                backendService.getLocations()
                    .then(function(data) {
                        var locations = [];
                        for (var i = 0; i < data.data.length; i++) {
                            locations.push(Location.fromJson(data.data[i]));
                        }
                        if (beforeActive) {
                            that.active = _.findWhere(locations, { id: beforeActive.id });
                            if (that.active) {
                                that.active.setActive();
                            }
                        }
                        that._deferredLocations.resolve(locations);
                    })
                ;

                // Return the promise
                return that._deferredLocations.promise;
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

            /**
             * Submits the given location to the backend
             * @param {Location} location
             * @return {HttpPromise}
             */
            LocationService.prototype.submitLocation = function(location) {
                // TODO: should the promise be handled in the controller?
                return backendService.submitLocation({
                    name: location.title,
                    lat: location.lat,
                    lng: location.lng,
                    type: location.type
                })
                    .success(function(data) {
                        // TODO: how to update the location from what the backend tells us
                        // TODO: this should be .id not ._id
                        location.id = data._id;
                        alertService.addAlert('Added new location "' + data.name + '"', 'success');
                    })
                    .error(function(data) {
                        // TODO: remove the location from the list
                        alertService.addAlert('Failed to add location: ' + data.error, 'danger');
                    })
                ;
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
