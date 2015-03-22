(function(module) {
    'use strict';
    module.factory('locationService', ['$q', 'Location', 'mapDefaults', 'backendService', 'alertService',
        function($q, Location, mapDefaults, backendService, alertService) {
            var DEFAULT_ZOOM = 2;
            var GEO_IP_ZOOM = 10;
            var MAP_CENTER_STORAGE_ID = 'veganautMapCenter';

            /**
             * Service to handle all things related to locations on the map
             * and the map itself.
             * @constructor
             */
            var LocationService = function() {
                /**
                 * The currently active location
                 * @type {Location}
                 */
                this.active = undefined;

                /**
                 * List of active filters
                 * @type {{}}
                 */
                this.activeFilters = {
                    recent: 'anytime',
                    type: 'anytype'
                };

                /**
                 * Main map settings:
                 *  - current center of the map
                 *  - leaflet "defaults" settings
                 * TODO: does this belong in the service?
                 * @type {{}}
                 */
                this.mapSettings = {
                    center: {},
                    defaults: mapDefaults
                };

                this._setMapCenter();
            };

            /**
             * Possible filter options for all the available filters
             * @type {{recent: string[]}}
             */
            LocationService.prototype.POSSIBLE_FILTERS = {
                recent: [
                    'anytime',
                    'month',
                    'week',
                    'day'
                ],
                type: [
                    'anytype',
                    'gastronomy',
                    'retail'
                ]

            };

            /**
             * Sets the map center either from local storage or
             * from asking the backend for a location
             * @private
             */
            LocationService.prototype._setMapCenter = function() {
                // Try to load from center from local storage
                this.mapSettings.center = JSON.parse(localStorage.getItem(MAP_CENTER_STORAGE_ID) || '{}');

                // Check if we loaded something
                if (Object.keys(this.mapSettings.center).length === 0) {
                    // If not, as the backend for a location
                    var that = this;
                    backendService.getGeoIP().then(function(res) {
                        // Check the data and set it
                        var geo = res.data;
                        if (angular.isNumber(geo.lat) && angular.isNumber(geo.lng)) {
                            that.mapSettings.center.lat = geo.lat;
                            that.mapSettings.center.lng = geo.lng;
                            that.mapSettings.center.zoom = GEO_IP_ZOOM;
                            that.saveMapCenter();
                        }
                    });
                }

                // Make sure we already have a valid center now
                _.defaults(this.mapSettings.center, {
                    lat: 0,
                    lng: 0,
                    zoom: DEFAULT_ZOOM
                });
            };

            /**
             * Saves the map center in local storage
             */
            LocationService.prototype.saveMapCenter = function() {
                // TODO: is this a privacy issue if we don't clear this when the user logs out?
                localStorage.setItem(MAP_CENTER_STORAGE_ID,
                    JSON.stringify(this.mapSettings.center)
                );
            };

            /**
             * Returns a Promise that will resolve to the locations
             * @returns {Promise}
             */
            LocationService.prototype.getLocations = function() {
                var that = this;
                var deferredLocations = $q.defer();
                var beforeActive = this.active;
                that.active = undefined;
                backendService.getLocations()
                    .then(function(data) {
                        var locations = {};
                        var location;
                        for (var i = 0; i < data.data.length; i++) {
                            // Instantiate the locations and index them by id
                            location = new Location(data.data[i]);
                            locations[location.id] = location;
                        }
                        if (beforeActive && locations[beforeActive.id]) {
                            that.activate(locations[beforeActive.id]);
                        }
                        deferredLocations.resolve(locations);
                    })
                ;

                // Return the promise
                return deferredLocations.promise;
            };

            /**
             * Returns the Location with the given id
             * @param id
             * @returns {Location}
             */
            LocationService.prototype.getLocation = function(id) {
                var deferredLocation = $q.defer();
                backendService.getLocation(id)
                    .then(function(res) {
                        deferredLocation.resolve(new Location(res.data));
                    })
                ;

                // Return the promise
                return deferredLocation.promise;
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

                    // Check if this is a location that has an id (= not one that is being added right now)
                    if (angular.isDefined(location.id)) {
                        // Get details (for the products)
                        this.getLocation(location.id).then(function(newLocationData) {
                            location.update(newLocationData);
                        });
                    }
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
                    name: location.name,
                    lat: location.lat,
                    lng: location.lng,
                    type: location.type
                })
                    .success(function(data) {
                        // Update the location
                        location.update(data);
                        alertService.addAlert('Added new location "' + location.name + '"', 'success');
                    })
                    .error(function(data) {
                        // TODO: remove the location from the list
                        alertService.addAlert('Failed to add location: ' + data.error, 'danger');
                    })
                ;
            };

            /**
             * Sends the current location data to the backend.
             * Updates only name, description and link at the moment.
             * @param {Location} location
             * @returns {HttpPromise}
             */
            LocationService.prototype.updateLocation = function(location) {
                return backendService.updateLocation(location.id, {
                    name: location.name,
                    description: location.description,
                    type: location.type,
                    link: location.link
                })
                    .success(function(data) {
                        // Update the location
                        location.update(data);
                        alertService.addAlert('Updated location "' + location.name + '"', 'success');
                    })
                    .error(function(data) {
                        // TODO: should reset the location data to what it previsouly was
                        alertService.addAlert('Failed to update location: ' + data.error, 'danger');
                    })
                ;
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
