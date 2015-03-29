(function(module) {
    'use strict';
    module.factory('locationService', [
        '$q', '$location', 'Location', 'mapDefaults', 'backendService', 'alertService',
        function($q, $location, Location, mapDefaults, backendService, alertService) {
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
                    center: {
                        lat: 0,
                        lng: 0,
                        zoom: DEFAULT_ZOOM
                    },
                    defaults: mapDefaults
                };

                this._initialiseMapCenter();
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
             * Sets the map center either from the url hash, local storage or
             * from asking the backend for a location
             * @private
             */
            LocationService.prototype._initialiseMapCenter = function() {
                var that = this;

                // Try setting from the URL hash
                var centerSet = that.setMapCenterFromUrl();

                // Try to load from center from local storage
                if (!centerSet) {
                    centerSet = that._setMapCenterFromLocalStorage();
                }

                // Finally, ask the backend for a center
                if (!centerSet) {
                    backendService.getGeoIP().then(function(res) {
                        // Try to set the received center
                        that._setMapCenterIfValid(res.data.lat, res.data.lng, GEO_IP_ZOOM);
                    });
                }
            };

            /**
             * Checks if the given center and zoom coordinates are valid
             * and sets them if they are.
             * @param {number} lat
             * @param {number} lng
             * @param {number} zoom
             * @returns {boolean} Whether the center was set
             * @private
             */
            LocationService.prototype._setMapCenterIfValid = function(lat, lng, zoom) {
                if (angular.isNumber(lat) && isFinite(lat) &&
                    angular.isNumber(lng) && isFinite(lat) &&
                    angular.isNumber(zoom) && isFinite(lat))
                {
                    this.mapSettings.center.lat = lat;
                    this.mapSettings.center.lng = lng;
                    this.mapSettings.center.zoom = zoom;

                    this.saveMapCenter();
                    return true;
                }
                return false;
            };

            /**
             * Try to read the map center from local storage
             * @returns {boolean} Whether the center was set
             * @private
             */
            LocationService.prototype._setMapCenterFromLocalStorage = function() {
                var center = JSON.parse(localStorage.getItem(MAP_CENTER_STORAGE_ID) || '{}');
                return this._setMapCenterIfValid(center.lat, center.lng, center.zoom);
            };

            /**
             * Try to read the map center from the url hash
             * @returns {boolean} Whether the center was set
             */
            LocationService.prototype.setMapCenterFromUrl = function() {
                var hashArgs = $location.hash().split(',');
                if (hashArgs.length === 3) {
                    return this._setMapCenterIfValid(
                        parseFloat(hashArgs[0]),
                        parseFloat(hashArgs[1]),
                        parseInt(hashArgs[2], 10)
                    );
                }
                return false;
            };

            /**
             * Saves the map center in local storage and in the url
             */
            LocationService.prototype.saveMapCenter = function() {
                // Store it in local storage
                localStorage.setItem(MAP_CENTER_STORAGE_ID,
                    JSON.stringify(this.mapSettings.center)
                );

                // Store it in the url hash (without adding a new history item)
                $location.replace();
                $location.hash(
                    this.mapSettings.center.lat.toFixed(7) + ',' +
                    this.mapSettings.center.lng.toFixed(7) + ',' +
                    this.mapSettings.center.zoom
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
