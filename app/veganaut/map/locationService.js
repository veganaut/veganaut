(function(module) {
    'use strict';
    module.factory('locationService', [
        '$q', '$rootScope', 'Location', 'LocationSet', 'backendService', 'alertService', 'locationFilterService',
        function($q, $rootScope, Location, LocationSet, backendService, alertService, locationFilterService) {
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
                 * Promise of the request currently in progress or false
                 * if not request is running.
                 * @type {Promise|boolean}
                 * @private
                 */
                this._requestInProgress = false;
            };

            /**
             * The possible types of locations
             * @type {string[]}
             */
            LocationService.prototype.LOCATION_TYPES = ['gastronomy', 'retail'];

            /**
             * Handles locations received from the backend and returns the instantiated
             * Location objects indexed by location id.
             * @param {[]} data
             * @private
             */
            LocationService.prototype._handleLocationResult = function(data) {
                // Index data by id and pass to location set
                this._locationSet.updateSet(_.indexBy(data, 'id'));

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
                var queryDeferred = $q.defer();

                // Add the active filters to the params
                params.type = locationFilterService.getTypeFilterValue();
                queryId += '-type' + params.type;

                params.updatedWithin = locationFilterService.getRecentFilterValue();
                queryId += '-updatedWithin' + params.updatedWithin;

                // Cancel ongoing request
                if (angular.isObject(this._requestInProgress)) {
                    this._requestInProgress.cancelRequest();
                    this._requestInProgress = false;
                }

                // Check if that query is already fulfilled
                if (this._currentQueryId === queryId) {
                    // Resolve deferred right away
                    queryDeferred.resolve();
                }
                else {
                    // Query not fulfilled yet, start backend request
                    this._requestInProgress = backendService.getLocations(params);
                    this._requestInProgress.then(function(data) {
                        // No longer requesting
                        this._requestInProgress = false;

                        // Set the query to be the current one
                        // (so we don't have to run it again if the next query is the same).
                        this._currentQueryId = queryId;

                        // Handle result
                        this._handleLocationResult(data.data);

                        // Resolve deferred
                        queryDeferred.resolve();
                    }.bind(this));
                    // TODO: reject deferred on failure
                }

                // Return promise that will resolve once the query is fulfilled
                return queryDeferred.promise;
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
             * @param {number} zoom The current zoom level of the map.
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
                    zoom: zoom
                });
            };

            /**
             * Returns a promise to the locations around the radius of the given center
             * @param {number} lat
             * @param {number} lng
             * @param {number} radius
             * @returns {Promise} Will resolve when the locationSet has been updated.
             */
            LocationService.prototype.queryByRadius = function(lat, lng, radius) {
                // Create an id for this query
                // TODO: constant "7"  should go elsewhere; or should we just hash this more automatically?
                var queryId = 'radius' + lat.toFixed(7) + '-' + lng.toFixed(7) + '-' + radius.toFixed(0);

                // Set the query
                return this._setQuery(queryId, {
                    lat: lat,
                    lng: lng,
                    radius: radius
                });
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
                    ;
                }

                // Return the promise
                return deferredLocation.promise;
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
                    });
            };

            return new LocationService();
        }
    ]);
})(window.veganaut.mapModule);
