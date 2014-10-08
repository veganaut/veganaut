(function(module) {
    'use strict';

    module.service('Location', ['Visit',
        function(Visit) {
            /**
             * Location Model
             *
             * @param {string} id
             * @param {string} team
             * @param {number} lat
             * @param {number} lng
             * @param {string} title
             * @param {string} type
             * @param {{}} [points={}]
             * @param {number} quality
             * @param {[]} products
             * @param {{}} lastMissionDates
             * @constructor
             */
            function Location(id, team, lat, lng, title, type, points, quality, products, lastMissionDates) {
                this.id = id;
                this.team = team;
                this.lat = lat;
                this.lng = lng;
                this.title = title; // TODO: rename to "name"
                this.type = type;
                this.points = points || {};
                this.quality = Math.min(5, Math.max(0, Math.round(quality || 0)));
                this.products = products || [];
                this.lastMissionDates = lastMissionDates || {};
                this._active = false;

                this.icon = {
                    type: 'div',
                    iconSize: null, // Needs to be set to null so it can be specified in CSS
                    className: ''
                };

                this._updateMarkerIcon();
            }

            /**
             * The possible types of locations
             * @type {{gastronomy: string, retail: string, event: string, private: string}}
             */
            Location.TYPES = {
                gastronomy: 'gastronomy',
                retail: 'retail'
            };

            /**
             * Creates a new Location object from the given JSON data
             * @param json
             * @returns {Location}
             */
            Location.fromJson = function(json) {
                // TODO: this is getting ridiculous, seriously dude
                var lastMissionDates = {};
                _.forOwn(json.lastMissionDates, function(date, mission) {
                    lastMissionDates[mission] = new Date(date);
                });
                return new Location(
                    json.id,
                    json.team,
                    json.lat,
                    json.lng,
                    json.name,
                    json.type,
                    json.points,
                    json.quality,
                    json.products,
                    lastMissionDates
                );
            };

            /**
             * Sets the icon html and css classes
             * @private
             */
            Location.prototype._updateMarkerIcon = function() {
                // Set the html based on the "quality"
                this.icon.html = '';
                if (this.quality > 0) {
                    this.icon.html = '<span class="map-icon icon icon-' + this.quality + '"></span>';
                }

                // Set the class list
                this.icon.className = 'map-location type-' + this.type + ' team-' + this.team;
                if (this._active) {
                    this.icon.className += ' active';
                }
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
             * Updates this Location with the new data loaded from the backend
             * @param {{}} newData
             */
            Location.prototype.update = function(newData) {
                // TODO: should only update what is actually given in the newData
                // TODO: should be merged somehow with fromJson and just be less ugly
                this.id = newData.id;
                this.team = newData.team;
                this.title = newData.name || newData.title; // TODO: this is a mess: locationService returns already instantiated model, shouldn't.
                this.points = newData.points;
                this.quality = newData.quality;
                this.products = newData.products;
                this.lastMissionDates = newData.lastMissionDates;
                this._updateMarkerIcon();

                // Clear points memoiziation
                this.sortedPoints = undefined;
            };

            return Location;
        }
    ]);
})(window.veganaut.mapModule);
