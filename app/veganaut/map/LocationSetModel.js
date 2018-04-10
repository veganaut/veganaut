angular.module('veganaut.app.map').factory('LocationSet', [
    '$rootScope', 'angularPiwik', 'backendService', 'alertService', 'Location', 'LocationCluster', 'CreateLocation',
    function($rootScope, angularPiwik, backendService, alertService, Location, LocationCluster, CreateLocation) {
        'use strict';

        /**
         * Set of locations and location clusters belonging together in some way.
         * One of the locations in the set can be "active".
         * @constructor
         */
        function LocationSet() {
            /**
             * Locations in this set (mapped from id to location)
             * @type {{}}
             */
            this.locations = {};

            /**
             * LocationClusters in this set (mapped from id to locationSet)
             * @type {{}}
             */
            this.locationClusters = {};

            /**
             * Combined list of Locations and LocationClusters (mapped by id).
             * TODO: find better name than LocationItem
             * @type {{}}
             */
            this.allLocationItems = {};

            /**
             * The currently active location
             * @type {Location}
             */
            this.active = undefined;

            /**
             * The location that is currently being created
             * @type {CreateLocation}
             */
            this.createLocation = undefined;

            /**
             * Total locations in this set (including all the ones that are clustered)
             * @type {number}
             */
            this.totalLocations = 0;
        }

        /**
         * Sets the given location as active. Deactivates it if it's already active.
         * @param {Location} [location]
         */
        LocationSet.prototype.activate = function(location) {
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

                // Check if this location's id is not "new" (= not being created right now)
                // TODO: should rather use method on Loction model
                if (location.id !== 'new') {
                    // Get details (for the products)
                    // TODO: should only get data if not already gotten, or just use $http cache?
                    // TODO: Would be better to use locationService.loadFullLocation() but cannot because of circular dep.
                    backendService.getLocation(location.id)
                        .then(function(res) {
                            location.update(res.data);
                        })
                    ;
                }
            }
        };

        /**
         * Returns whether we are currently in the process of creating a new location
         * @returns {boolean}
         */
        LocationSet.prototype.isCreatingLocation = function() {
            return angular.isObject(this.createLocation);
        };

        /**
         * Starts to create a new location. Will instantiate a new CreateLocation.
         * @param {{}} player Player that adds the location
         * @param {{}} map Map on which the location is added
         */
        LocationSet.prototype.startCreateLocation = function(player, map) {
            this.createLocation = new CreateLocation(player, map);
            this.activate(this.createLocation.newLocation);

            // Broadcast addition and track
            $rootScope.$broadcast('veganaut.locationSet.locationItem.added', this.createLocation.newLocation);
            angularPiwik.track('map.addLocation', 'start');
        };

        /**
         * Aborts creating a new location.
         */
        LocationSet.prototype.abortCreateLocation = function() {
            if (this.isCreatingLocation()) {
                var abortedLocation = this.createLocation.newLocation;
                this.createLocation = undefined;

                // Deactivate the location that was aborted
                this.activate();

                // Broadcast removal and track
                $rootScope.$broadcast('veganaut.locationSet.locationItem.removed', abortedLocation);
                angularPiwik.track('map.addLocation', 'abort');
            }
        };

        /**
         * Submits the location that is currently being created to the backend
         */
        LocationSet.prototype.submitCreateLocation = function() {
            var that = this;

            // TODO WIP NOW: the map should be in the correct mode (category) when the location is added otherwise it gets confusing

            // Check if we can actually submit the location
            if (that.isCreatingLocation() &&
                that.createLocation.isLastStep() &&
                that.createLocation.stepIsValid())
            {
                // Get the new location and unset create location
                // This should prevent multiple submissions
                var newLocation = that.createLocation.newLocation;
                that.createLocation = undefined;

                // Create deferred to return
                backendService.submitLocation({
                    name: newLocation.name,
                    lat: newLocation.lat,
                    lng: newLocation.lng,
                    type: newLocation.type
                })
                    .success(function(data) {
                        // Update the location, we broadcast removal and addition because the id will change
                        $rootScope.$broadcast('veganaut.locationSet.locationItem.removed', newLocation);
                        newLocation.update(data);

                        // The location is no longer being edited
                        newLocation.setEditing(false);

                        // Add to list
                        // TODO: make a helper method to add locations and locationClusters to not forget to update allLocationItems
                        that.totalLocations += 1;
                        that.locations[newLocation.id] = newLocation;
                        that.allLocationItems[newLocation.id] = newLocation;

                        // Broadcast the new final location and add an alert
                        $rootScope.$broadcast('veganaut.locationSet.locationItem.added', newLocation);
                        alertService.addAlert('Added new location "' + newLocation.name + '"', 'success');
                        angularPiwik.track('map.addLocation', 'finish');
                    })
                    .error(function(data) {
                        // Broadcast removal and show alert
                        $rootScope.$broadcast('veganaut.locationSet.locationItem.removed', newLocation);
                        alertService.addAlert('Failed to add location: ' + data.error, 'danger');
                        angularPiwik.track('map.addLocation', 'submitError');
                    })
                ;
            }
            else {
                // This should not happen
                console.error('Tried to submit new location with incomplete data.');
            }
        };

        /**
         * Updates this set with the given new data
         * @param {{}} newData Raw location data from the backend (clusters and locations)
         */
        LocationSet.prototype.updateSet = function(newData) {
            var that = this;

            // Store the total locations in the set
            that.totalLocations = newData.totalLocations;

            // Index the locations and clusters by id
            newData.locations = _.indexBy(newData.locations, 'id');
            newData.clusters = _.indexBy(newData.clusters, 'id');

            // Get the ids of all new and old location items
            var newLocationItems = _.extend({}, newData.locations, newData.clusters);
            var newItemIds = Object.keys(newLocationItems);
            var oldItemIds = Object.keys(that.allLocationItems);

            // Loop through items that are gone
            angular.forEach(_.difference(oldItemIds, newItemIds), function(id) {
                var removedItem = that.allLocationItems[id];
                delete that.locations[id];
                delete that.locationClusters[id];
                delete that.allLocationItems[id];
                $rootScope.$broadcast('veganaut.locationSet.locationItem.removed', removedItem);
            });

            // Loop through new items
            angular.forEach(_.difference(newItemIds, oldItemIds), function(id) {
                var addedItem;
                if (angular.isObject(newData.locations[id])) {
                    addedItem = new Location(newData.locations[id]);
                    that.locations[id] = addedItem;
                }
                else if (angular.isObject(newData.clusters[id])) {
                    addedItem = new LocationCluster(newData.clusters[id]);
                    that.locationClusters[id] = addedItem;
                }
                that.allLocationItems[id] = addedItem;
                $rootScope.$broadcast('veganaut.locationSet.locationItem.added', that.allLocationItems[id]);
            });

            // Loop through items that are still around
            angular.forEach(_.intersection(newItemIds, oldItemIds), function(id) {
                // TODO: location sends the update (and only for marker changed), is that OK?
                that.allLocationItems[id].update(newLocationItems[id]);
            });

            // Deactivate the location that was active if it's no longer around
            // (and if it's not the location we are just creating).
            if (angular.isObject(that.active) &&
                (!that.isCreatingLocation() || that.active !== that.createLocation.newLocation) &&
                !angular.isObject(that.locations[that.active.id]))
            {
                that.activate();
            }
        };

        return LocationSet;
    }
]);
