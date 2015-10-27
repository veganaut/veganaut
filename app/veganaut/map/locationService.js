(function(module) {
    'use strict';
    module.factory('locationService', [
        '$q', 'Location', 'angularPiwik', 'backendService', 'alertService',
        function($q, Location, angularPiwik, backendService, alertService) {
            /**
             * Service to handle the veganaut locations
             * @constructor
             */
            var LocationService = function() {
                /**
                 * The currently active location
                 * @type {Location}
                 */
                this.active = undefined;

                /**
                 * The location that is currently being added
                 * @type {Location}
                 */
                this.newLocation = undefined;

                /**
                 * List of active filters
                 * @type {{}}
                 */
                this.activeFilters = {
                    recent: 'anytime',
                    type: 'anytype'
                };
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
             * Handles locations received from the backend and returns the instantiated
             * Location objects indexed by location id.
             * @param data
             * @returns {{}}
             * @private
             */
            LocationService.prototype._handleLocationResult = function(data) {
                var locations = {};
                var location;
                for (var i = 0; i < data.length; i++) {
                    // Instantiate the locations and index them by id
                    location = new Location(data[i]);
                    locations[location.id] = location;
                }

                // Add the location that is being created back to the list
                if (this.newLocation) {
                    locations[this.newLocation.id] = this.newLocation;
                }

                // Deactivate the location and activate it again if it's still around
                var beforeActive = this.active;
                this.activate();
                if (beforeActive && locations[beforeActive.id]) {
                    this.activate(locations[beforeActive.id]);
                }

                return locations;
            };

            /**
             * Returns a promise to the locations within the given bounds
             * @param {string} bounds The bounds within to get the locations
             * @returns {Promise}
             */
            LocationService.prototype.getLocationsByBounds = function(bounds) {
                var that = this;
                var deferredLocations = $q.defer();
                backendService.getLocationsByBounds(bounds)
                    .then(function(data) {
                        deferredLocations.resolve(that._handleLocationResult(data.data));
                    })
                ;

                return deferredLocations.promise;
            };

            /**
             * Returns a promise to the locations around the radius of the given center
             * @param {number} lat
             * @param {number} lng
             * @param {number} radius
             * @returns {Promise}
             */
            LocationService.prototype.getLocationsByRadius = function(lat, lng, radius) {
                var that = this;
                var deferredLocations = $q.defer();
                backendService.getLocationsByRadius(lat, lng, radius)
                    .then(function(data) {
                        deferredLocations.resolve(that._handleLocationResult(data.data));
                    })
                ;

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
             * Start to create a new location
             * @param {{}} player
             */
            LocationService.prototype.startAddNewLocation = function(player) {
                this.newLocation = new Location({owner: player});
                this.newLocation.setEditing(true);
                this.activate(this.newLocation);

                angularPiwik.track('map.addLocation', 'start');
            };

            /**
             * Abort adding a new location
             */
            LocationService.prototype.abortAddNewLocation = function() {
                this.newLocation = undefined;
                this.activate();
            };

            /**
             * Returns whether we are currently in the process of adding a new location
             * @returns {boolean}
             */
            LocationService.prototype.isAddingLocation = function() {
                return angular.isDefined(this.newLocation);
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
             * Submits the location that is currently being created to the backend
             * @return {Promise}
             */
            LocationService.prototype.submitNewLocation = function() {
                var that = this;
                if (!that.isAddingLocation()) {
                    throw new Error('Cannot submit new location because no new location is being added.');
                }

                // Reset the new location reference
                var location = that.newLocation;
                that.newLocation = undefined;

                // The location is no longer being edited
                location.setEditing(false);

                // Create deferred to return
                var deferred = $q.defer();
                backendService.submitLocation({
                    name: location.name,
                    lat: location.lat,
                    lng: location.lng,
                    type: location.type
                })
                    .success(function(data) {
                        // Update the location
                        location.update(data);
                        deferred.resolve(location);
                    })
                    .error(function(data) {
                        deferred.reject(data.error);
                    })
                ;

                return deferred.promise;
            };

            /**
             * Sends the current location data to the backend.
             * Updates only name, description and link at the moment.
             * @param {Location} location
             * @returns {HttpPromise}
             */
            LocationService.prototype.updateLocation = function(location) {
                // Sanitise the link before saving
                location.sanitiseLink();

                // TODO: should find out what has been edited and only send that
                return backendService.updateLocation(location.id, {
                    name: location.name,
                    description: location.description,
                    type: location.type,
                    link: location.link,
                    lat: location.lat,
                    lng: location.lng
                })
                    .success(function(data) {
                        // Update the location
                        location.update(data);
                        alertService.addAlert('Updated location "' + location.name + '"', 'success');
                    })
                    .error(function(data) {
                        // TODO: should reset the location data to what it previously was
                        alertService.addAlert('Failed to update location: ' + data.error, 'danger');
                    })
                ;
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
