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
             * Returns a Promise that will resolve to the locations
             * @param {string} [bounds] The bounds within to get the locations
             * @returns {Promise}
             */
            LocationService.prototype.getLocations = function(bounds) {
                var that = this;
                var deferredLocations = $q.defer();
                var beforeActive = that.active;
                backendService.getLocations(bounds)
                    .then(function(data) {
                        var locations = {};
                        var location;
                        for (var i = 0; i < data.data.length; i++) {
                            // Instantiate the locations and index them by id
                            location = new Location(data.data[i]);
                            locations[location.id] = location;
                        }

                        // Add the location that is being created back to the list
                        if (that.newLocation) {
                            locations[that.newLocation.id] = that.newLocation;
                        }

                        // Deactivate the location and activate it again if it's still around
                        that.activate();
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
             * Start to create a new location
             * @param {{}} player
             */
            LocationService.prototype.startAddNewLocation = function(player) {
                this.newLocation = new Location({team: player.team});
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
