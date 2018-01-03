(function(module) {
    'use strict';
    module.factory('locationService', [
        '$q', '$rootScope', 'constants', 'Location', 'LocationSet',
        'backendService', 'alertService', 'locationFilterService',
        function($q, $rootScope, constants, Location, LocationSet,
            backendService, alertService, locationFilterService)
        {
            /**
             * Service to handle the veganaut locations
             * @constructor
             */
            var LocationService = function() {
                /**
                 * The global location set that will be updated when
                 * location queries are set.
                 */
                this._locationSet = new LocationSet();

                /**
                 * The id of the query whose result is currently held
                 * in the locationSet.
                 * @type {string}
                 * @private
                 */
                this._currentQueryId = undefined;

                /**
                 * Promise of the backend request currently in progress or
                 * false if not request is running.
                 * @type {Promise|boolean}
                 * @private
                 */
                this._requestInProgress = false;

                /**
                 * Deferred which's promise was returned to the caller waiting
                 * for the updated locations.
                 * @type {Promise}
                 * @private
                 */
                this._requestInProgressDeferred = undefined;

                /**
                 * The id of the query that is currently being requested
                 * from the backend.
                 * @type {string}
                 * @private
                 */
                this._requestInProgressQueryId = undefined;
            };

            /**
             * The possible types of locations
             * @type {string[]}
             */
            LocationService.prototype.LOCATION_TYPES = ['gastronomy', 'retail'];

            /**
             * Handles map data received from the backend by updating the location set.
             * @param {[]} data
             * @private
             */
            LocationService.prototype._handleLocationResult = function(data) {
                // Pass the new data to the location set
                this._locationSet.updateSet(data);

                // Broadcast that we updated the set
                $rootScope.$broadcast('veganaut.locationSet.updated');
            };

            /**
             * Sets the given query (id and params). Will launch a request to the
             * backend if the query is not fulfilled yet and abort ongoing requests.
             * @param {string} queryId
             * @param {{}} params
             * @returns {Promise}
             * @private
             */
            LocationService.prototype._setQuery = function(queryId, params) {
                // Add the active filters to the params
                params.type = locationFilterService.getTypeFilterValue();
                queryId += '-type' + params.type;

                params.updatedWithin = locationFilterService.getRecentFilterValue();
                queryId += '-updatedWithin' + params.updatedWithin;

                // Cancel ongoing request
                if (angular.isObject(this._requestInProgress)) {
                    if (this._requestInProgressQueryId === queryId) {
                        // We are already running the desired query, just return the existing promise
                        return this._requestInProgressDeferred.promise;
                    }
                    else {
                        // Asked for a new query, cancel the ongoing request
                        this._requestInProgress.cancelRequest();
                        this._requestInProgress = false;

                        // Reject last request
                        // TODO: what message to reject it with?
                        this._requestInProgressDeferred.reject();
                        this._requestInProgressDeferred = undefined;
                    }

                }

                // Check if that query is already fulfilled
                if (this._currentQueryId === queryId) {
                    // Return a resolved promise right away
                    return $q.when();
                }
                else {
                    // Query not fulfilled yet, start backend request
                    this._requestInProgressQueryId = queryId;
                    this._requestInProgressDeferred = $q.defer();

                    this._requestInProgress = backendService.getLocations(params);
                    this._requestInProgress.then(function(data) {
                        // No longer requesting
                        this._requestInProgress = false;

                        // Set the query to be the current one
                        // (so we don't have to run it again if the next query is the same).
                        this._currentQueryId = this._requestInProgressQueryId;

                        // Handle result
                        this._handleLocationResult(data.data);

                        // Resolve deferred
                        this._requestInProgressDeferred.resolve();
                        this._requestInProgressDeferred = undefined;
                    }.bind(this));
                    // TODO: reject deferred on failure

                    // Return promise that will resolve once the query is fulfilled
                    return this._requestInProgressDeferred.promise;
                }
            };

            /**
             * Returns the location set managed by the location service.
             * Will update when queries are changed.
             * @returns {LocationSet}
             */
            LocationService.prototype.getLocationSet = function() {
                return this._locationSet;
            };

            /**
             * Returns a promise to the locations within the given bounds
             * @param {string} bounds The bounds within to get the locations.
             * @param {number} zoom The current zoom level of the map (for cluster)
             * @returns {Promise} Will resolve when the locationSet has been updated.
             */
            LocationService.prototype.queryByBounds = function(bounds, zoom) {
                // Create an id for this query
                // TODO: the bounds are too precise, should round coords more
                // TODO: find better way to do queryId (let _setQuery do sth automatic)
                var queryId = 'bounds' + bounds + '-zoom' + zoom;

                // Set the query
                return this._setQuery(queryId, {
                    bounds: bounds,
                    clusterLevel: zoom
                });
            };

            /**
             * Returns a promise to the locations around the radius of the given center
             * @param {number} lat
             * @param {number} lng
             * @param {number} radius
             * @param {number} limit
             * @param {number} skip
             * @param {string} [addressType]
             * @returns {Promise} Will resolve when the locationSet has been updated.
             */
            LocationService.prototype.getLocationsByRadius = function(lat, lng, radius, limit, skip, addressType) {
                return backendService.getLocations({
                    lat: lat,
                    lng: lng,
                    radius: radius,
                    limit: limit,
                    skip: skip,
                    addressType: addressType,
                    type: locationFilterService.getTypeFilterValue(),
                    updatedWithin: locationFilterService.getRecentFilterValue()
                }).then(function(res) {
                    // Instantiate the locations
                    _.each(res.data.locations, function(locationData, i) {
                        res.data.locations[i] = new Location(locationData);
                    });
                    return res.data;
                });
            };

            /**
             * Searches for locations matching the given string and returns a list of them
             *
             * @param {string} searchString
             * @param {number} limit
             * @returns {Promise} Will resolve to an array of Locations
             */
            LocationService.prototype.searchLocations = function(searchString, limit) {
                var deferred = $q.defer();

                backendService.getLocationSearch(searchString, limit)
                    .then(function(res) {
                        var results = [];
                        _.each(res.data, function(data) {
                            results.push(new Location(data));
                        });
                        deferred.resolve(results);
                    })
                    .catch(function(data) {
                        deferred.reject(data);
                    })
                ;

                // Return the promise
                return deferred.promise;
            };

            /**
             * Returns the Location with the given id.
             * If the location is already contained in the current
             * locationSet, will return that instance.
             * @param {string} id
             * @returns {Promise}
             */
            LocationService.prototype.getLocation = function(id) {
                var deferredLocation = $q.defer();

                // Check if we already have this location in the current set
                if (angular.isObject(this._locationSet.locations) &&
                    angular.isObject(this._locationSet.locations[id]))
                {
                    // Make sure the location is active (so the details are fetched)
                    var location = this._locationSet.locations[id];
                    if (this._locationSet.active !== location) {
                        this._locationSet.activate(location);
                    }

                    // Resolve directly with that location
                    deferredLocation.resolve(location);
                }
                else {
                    backendService.getLocation(id)
                        .then(function(res) {
                            deferredLocation.resolve(new Location(res.data));
                        })
                        .catch(function(res) {
                            deferredLocation.reject(res.data);
                        })
                    ;
                }

                // Return the promise
                return deferredLocation.promise;
            };

            /**
             * Loads the full location data for the given location
             * (that was previously loaded partially).
             * @param {Location} location
             * @returns {Promise}
             */
            LocationService.prototype.loadFullLocation = function(location) {
                return backendService.getLocation(location.id)
                    .then(function(res) {
                        location.update(res.data);
                        return location;
                    })
                ;
            };

            /**
             * Sends the current location data to the backend.
             * Updates only name, description and website at the moment.
             * @param {Location} location
             * @returns {HttpPromise}
             */
            LocationService.prototype.updateLocation = function(location) {
                // Sanitise the website before saving
                location.sanitiseWebsite();

                // TODO: should find out what has been edited and only send that
                return backendService.updateLocation(location.id, {
                        name: location.name,
                        description: location.description,
                        type: location.type,
                        website: location.website,
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
                    });
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
