(function(module) {
    'use strict';

    module.service('LocationCluster', ['$rootScope',
        function($rootScope) {
            /**
             * Represents a location cluster on the map.
             *
             * @param {{}} [jsonData={}]
             * @constructor
             */
            function LocationCluster(jsonData) {
                // Explicitly define all the properties

                /**
                 * Id of this location cluster.
                 * @type {string}
                 */
                this.id = undefined;
                this.lat = undefined;
                this.lng = undefined;
                this.clusterSize = undefined;
                this.numOwned = undefined;
                this.sizeName = undefined;

                /**
                 * Defines all the properties for the Leaflet marker to
                 * represent this location.
                 * @type {{}}
                 * @private
                 */
                this._markerDefinition = undefined;

                // Apply the given data (will also set marker definition)
                this.update(jsonData);
            }

            /**
             * Returns the marker definition to be used for this location.
             * The event 'veganaut.locationItem.marker.updated' will be broadcast
             * when the definition changes.
             * @returns {{}}
             */
            LocationCluster.prototype.getMarkerDefinition = function() {
                return this._markerDefinition;
            };

            /**
             * Get the list of class names to be used for the marker icon.
             * @returns {string}
             */
            LocationCluster.prototype._getMarkerIconClasses = function() {
                // Set owner class if the user owns anything in this cluster
                var ownerClass = '';
                if (angular.isNumber(this.clusterSize) &&
                    angular.isNumber(this.numOwned) &&
                    this.clusterSize > 0 &&
                    this.numOwned > 0)
                {
                    // Calculate percentage owned rounded up to the next 25%
                    var percentageOwned = Math.ceil(4 * this.numOwned / this.clusterSize) * 25;
                    ownerClass = ' marker-cluster--owner-' + percentageOwned;

                }

                // Compose the icon class name
                return ' marker-cluster' +
                    ' marker-cluster--size-' + this.sizeName +
                    ownerClass;
            };

            /**
             * Updates the marker definition of this location.
             * If the marker has changed, broadcasts an event letting all the shown
             * markers know they should get the newest marker definition.
             */
            LocationCluster.prototype.updateMarker = function() {
                // Store old definition to check for changes further down
                var oldDefinition = this._markerDefinition;

                // Set latLng if valid coordinates are available
                var latLng;
                if (angular.isNumber(this.lat) &&
                    angular.isNumber(this.lng))
                {
                    latLng = [this.lat, this.lng];
                }

                // Create current marker definition
                this._markerDefinition = {
                    latLng: latLng,
                    base: {
                        title: this.name,
                        clickable: false,
                        riseOnHover: false
                    },
                    icon: {
                        iconSize: null, // Needs to be set to null so it can be specified in CSS
                        className: this._getMarkerIconClasses()
                    },
                    // The z-index offset is set so that it's always behind all the location markers.
                    zIndexOffset: 50 * 1000
                };

                // Send updated event if it changed (but not if it was previously undefined;
                // in this case the location is just being initialised).
                if (angular.isObject(oldDefinition) && !_.isEqual(oldDefinition, this._markerDefinition)) {
                    $rootScope.$broadcast('veganaut.locationItem.marker.updated', this);
                }
            };

            /**
             * Updates this LocationCluster with the new data loaded from the backend
             * @param {{}} newData Raw (not instantiated LocationCluster!) data from the backend
             */
            LocationCluster.prototype.update = function(newData) {
                _.assign(this, newData || {});

                // Update the marker
                this.updateMarker();
            };

            return LocationCluster;
        }
    ]);
})(window.veganaut.mapModule);
