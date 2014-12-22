(function(module) {
    'use strict';

    module.service('Location', ['Leaflet', 'Visit',
        function(L, Visit) {
            /**
             * Represents a location on the map.
             * A location has general information (name, type, ...), coordinates
             * and aggregated data from missions as well as missions themselves.
             *
             * @param {{}} [jsonData={}]
             * @constructor
             */
            function Location(jsonData) {
                // Explicitly define all the properties
                this.id = undefined;
                this.team = undefined;
                this.lat = undefined;
                this.lng = undefined;
                this.name = undefined;
                this.description = undefined;
                this.link = undefined;
                this.type = undefined;
                this.points = {};
                this.quality = {
                    average: 0,
                    numRatings: 0
                };
                this.products = [];
                this.lastMissionDates = {};

                // Apply the given data
                // TODO: this should deep copy, otherwise quality might not have a valid value
                angular.extend(this, jsonData || {});

                /**
                 * Whether this location is shows as active on the map
                 * @type {boolean}
                 * @private
                 */
                this._active = false;

                /**
                 * Leaflet Marker representing this location
                 * @type {L.Marker}
                 */
                this.marker = L.marker([this.lat, this.lng], {
                    title: this.name
                });

                // Make sure the marker now which location it belongs to
                this.marker.locationId = this.id;

                // Instantiate the dates
                // TODO: this should already have been done elsewhere
                var that = this;
                _.forOwn(this.lastMissionDates, function(date, mission) {
                    that.lastMissionDates[mission] = new Date(date);
                });

                this._updateMarkerIcon();
            }

            /**
             * The possible types of locations
             * @type {{gastronomy: string, retail: string}}
             */
            Location.TYPES = {
                gastronomy: 'gastronomy',
                retail: 'retail'
            };

            /**
             * Sets the icon html and css classes
             * @private
             */
            Location.prototype._updateMarkerIcon = function() {
                // Create the basic icon settings
                var icon = {
                    iconSize: null, // Needs to be set to null so it can be specified in CSS
                    className: 'map-location type-' + this.type + ' team-' + this.team,
                    html: ''
                };

                // Set the html based on the "quality"
                if (this.quality.numRatings > 0) {
                    icon.html = '<span class="map-icon icon icon-' + this.getRoundedQuality() + '"></span>';
                }

                // Add active class if active
                if (this._active) {
                    icon.className += ' active';
                }

                // TODO: only do this if something actually changed
                this.marker.setIcon(L.divIcon(icon));
            };

            /**
             * Sets the lat/lng of this location and updates the
             * leaflet marker.
             * @param {number} lat
             * @param {number} lng
             */
            Location.prototype.setLatLng = function(lat, lng) {
                // TODO: make lat/lng private
                this.lat = lat;
                this.lng = lng;
                this.marker.setLatLng([this.lat, this.lng]);
            };

            /**
             * Sets the location as active or inactive
             * @param {boolean} [isActive=true]
             */
            Location.prototype.setActive = function(isActive) {
                if (typeof isActive === 'undefined') {
                    isActive = true;
                }
                this._active = isActive;

                // Update marker
                this._updateMarkerIcon();
            };

            /**
             * Whether the location is active
             * @returns {boolean}
             */
            Location.prototype.isActive = function() {
                return this._active;
            };

            /**
             * Returns an array of all the points starting with the highest:
             * { team: 'color', points: 100 }
             * @returns {{}}
             */
            Location.prototype.getSortedPoints = function() {
                // TODO: should be possible to clear the memoiziation
                this.sortedPoints = this.sortedPoints || _.chain(this.points)
                    .map(function(value, key) {
                        return { team: key, points: value };
                    })
                    .sortBy('points')
                    .reverse()
                    .value()
                ;
                return this.sortedPoints;
            };

            /**
             * Returns a visit of this location
             * @param {Player} player The player to get the visit for
             * @returns {Visit}
             */
            Location.prototype.getVisit = function(player) {
                if (this.type !== Location.TYPES.private) {
                    return new Visit(this, player);
                }
            };

            /**
             * Returns the Product with the given id if it exists
             * @param {string} productId
             * @return {Product}
             */
            Location.prototype.getProductById = function(productId) {
                return _.find(this.products, { id: productId });
            };

            /**
             * Returns the average quality rounded to a number between 0 and 5.
             * 0 means there are no ratings.
             * @returns {number}
             */
            Location.prototype.getRoundedQuality = function() {
                var avg = this.quality.average || 0;
                return Math.min(5, Math.max(0, Math.round(avg)));
            };

            /**
             * Returns the URL of this location
             * @param {boolean} [edit=false] Whether to return the URL to edit
             *      this location
             * @returns {string}
             */
            Location.prototype.getUrl = function(edit) {
                var url = '/location/' + this.id;
                if (edit === true) {
                    url += '/edit';
                }
                return url;
            };

            /**
             * Updates this Location with the new data loaded from the backend
             * @param {{}} newData
             */
            Location.prototype.update = function(newData) {
                // TODO: should only update what is actually given in the newData
                // TODO: should be merged with the constructor and just be less ugly
                // TODO: this is a mess: locationService returns already instantiated model, shouldn't.
                this.id = newData.id;
                this.team = newData.team;
                this.name = newData.name;
                this.description = newData.description;
                this.link = newData.link;
                this.points = newData.points;
                this.quality = newData.quality;
                this.products = newData.products;
                this.lastMissionDates = newData.lastMissionDates;
                this._updateMarkerIcon();
                this.setLatLng(newData.lat, newData.lng);

                // Clear points memoiziation
                this.sortedPoints = undefined;

                // TODO: update the marker 'title'
            };

            return Location;
        }
    ]);
})(window.veganaut.mapModule);
