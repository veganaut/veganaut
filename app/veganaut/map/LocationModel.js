(function(module) {
    'use strict';

    module.service('Location', ['Leaflet', 'playerService',
        function(L, playerService) {
            /**
             * Z-index offset to use for the marker when the location is active
             * @type {number}
             */
            var Z_INDEX_OFFSET_ACTIVE = 600000;

            /**
             * Z-index offset to use for the marker when the location is hovered
             * @type {number}
             */
            var Z_INDEX_OFFSET_HOVER = 700000;

            /**
             * Z-index offset to use for the marker when the location is disabled
             * @type {number}
             */
            var Z_INDEX_OFFSET_DISABLED = -1000;

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
                this.owner = undefined;
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
                this.effort = {
                    average: 0,
                    numRatings: 0
                };
                this.products = [];
                this.updatedAt = undefined;
                this._isBeingEdited = false;

                // Apply the given data
                // TODO: this should deep copy, otherwise quality might not have a valid value
                angular.extend(this, jsonData || {});

                /**
                 * Whether this location shows as active on the map
                 * @type {boolean}
                 * @private
                 */
                this._active = false;

                /**
                 * Whether this location is currently displayed on the map
                 * @type {boolean}
                 * @private
                 */
                this._disabled = false;

                /**
                 * Leaflet Marker representing this location
                 * @type {L.Marker}
                 */
                this.marker = L.marker([this.lat, this.lng], {
                    title: this.name,
                    riseOnHover: true,
                    riseOffset: Z_INDEX_OFFSET_HOVER
                });

                // Instantiate the dates
                // TODO: this should already have been done elsewhere
                this.updatedAt = new Date(this.updatedAt);

                this._updateMarker();
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
             * Icon CSS classes used for the type of location
             * @type {{gastronomy: string, retail: string}}
             * @private
             */
            Location._CLASS_FOR_TYPE = {
                gastronomy: 'glyphicon glyphicon-cutlery',
                retail: 'glyphicon glyphicon-shopping-cart'
            };

            /**
             * Returns the CSS icon class(es) for the given location type.
             * Returns false if no valid type is given.
             * @param {string} type
             * @returns {string|boolean}
             */
            Location.getIconClassForType = function(type) {
                var cls = Location._CLASS_FOR_TYPE[type];
                if (angular.isString(cls)) {
                    return cls;
                }
                return false;
            };

            /**
             * Returns whether this location is owned by the current player
             * @returns {boolean}
             */
            Location.prototype.isOwnedByPlayer = function() {
                var me = playerService.getImmediateMe();
                if (angular.isObject(me) && angular.isObject(this.owner)) {
                    return (this.owner.id === me.id);
                }
                return false;
            };

            /**
             * Makes sure the Leaflet marker is up to date with the current
             * model state. Sets the icon html and the css as well as the
             * locationId on the marker.
             * @private
             */
            Location.prototype._updateMarker = function() {
                // Create the basic icon settings
                var ownerClass = (this.isOwnedByPlayer() ? ' marker--owner ' : '');
                var icon = {
                    iconSize: null, // Needs to be set to null so it can be specified in CSS
                    className: 'marker marker--type-' + this.type +
                        ownerClass +
                        ' marker--quality-' + this.getRoundedQuality(),
                    html: ''
                };

                // Set a marker based on the type of location
                var typeIcon = Location.getIconClassForType(this.type);
                if (typeIcon) {
                    icon.html = '<span class="marker__icon marker__icon--type ' + typeIcon + '"></span>';
                }

                // Calculate the z-index offset:
                // Higher quality locations should be more in front. We take 2
                // decimal places of the average too have more layers than just
                // the rounded average. We then make sure the last 3 digits are
                // always 0. Those will be used by Leaflet to set a latitude
                // based offset.
                // Locations with no rating are counted as if they had a rating of 3
                // TODO: add a test for this
                // TODO: should use the rank, but isn't in frontend yet
                var zIndexOffset = Math.round((this.quality.average || 3) * 100) * 1000;

                // Add active class if active
                if (this._active) {
                    icon.className += ' marker--active';

                    // Active markers should be in front of all others (except hover)
                    zIndexOffset = Z_INDEX_OFFSET_ACTIVE;
                }

                // Special z-index when disabled
                if (this._disabled) {
                    zIndexOffset = Z_INDEX_OFFSET_DISABLED;
                }

                // Add editing class
                if (this._isBeingEdited) {
                    icon.className += ' marker--editing';
                }

                // Add disabled or enabled class
                icon.className += this._disabled ? ' marker--disabled' : ' marker--enabled';

                // TODO: only do this if something actually changed
                this.marker.setIcon(L.divIcon(icon));

                // Set the z-index offset
                this.marker.setZIndexOffset(zIndexOffset);

                // Make sure the marker still hast the correct location id set
                this.marker.locationId = this.id;
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
                isActive = !!isActive;

                // Update active state if it changed
                if (this._active !== isActive) {
                    this._active = isActive;

                    // Update marker
                    this._updateMarker();
                }
            };

            /**
             * Sets whether this location is currently being edited
             * @param {boolean} [isEditing=true]
             */
            Location.prototype.setEditing = function(isEditing) {
                if (typeof isEditing === 'undefined') {
                    isEditing = true;
                }
                isEditing = !!isEditing;

                // Update active state if it changed
                if (this._isBeingEdited !== isEditing) {
                    this._isBeingEdited = isEditing;

                    // Update marker
                    this._updateMarker();
                }
            };

            /**
             * Whether the location is active
             * @returns {boolean}
             */
            Location.prototype.isActive = function() {
                return this._active;
            };

            /**
             * Returns the number of points the current owner has
             * @returns {number}
             */
            Location.prototype.getOwnerPoints = function() {
                var points = 0;
                if (angular.isObject(this.owner) &&
                    angular.isString(this.owner.id) &&
                    angular.isNumber(this.points[this.owner.id]))
                {
                    points = this.points[this.owner.id];
                }
                return points;
            };

            /**
             * Sets the location to be disabled or enabled on the map.
             * Disabled locations are shown greyed out.
             * @param {boolean} isDisabled
             */
            Location.prototype.setDisabled = function(isDisabled) {
                if (typeof isDisabled === 'undefined') {
                    isDisabled = true;
                }
                isDisabled = !!isDisabled;

                // Update disabled state if it changed
                if (this._disabled !== isDisabled) {
                    this._disabled = isDisabled;

                    // Update marker
                    this._updateMarker();
                }
            };

            /**
             * Returns whether the location is diabled
             * @returns boolean
             */
            Location.prototype.isDisabled = function() {
                return this._disabled;
            };

            /**
             * Returns an array of all the points starting with the highest:
             * { player: id, points: 100 }
             * @returns {{}}
             */
            Location.prototype.getSortedPoints = function() {
                // TODO: should be possible to clear the memoiziation
                this._sortedPoints = this._sortedPoints || _.chain(this.points)
                    .map(function(value, key) {
                        return {player: key, points: value};
                    })
                    .sortBy('points')
                    .reverse()
                    .value()
                ;
                return this._sortedPoints;
            };

            /**
             * Returns the Product with the given id if it exists
             * @param {string} productId
             * @return {Product}
             */
            Location.prototype.getProductById = function(productId) {
                return _.find(this.products, {id: productId});
            };

            /**
             * Returns all products with the given availability
             * @param {string|string[]} filterBy A string for a single availability
             *      or an array of strings for multiple.
             * @return {Product[]}
             */
            Location.prototype.getProductsByAvailability = function(filterBy) {
                if (angular.isString(filterBy)) {
                    filterBy = [filterBy];
                }
                return _.filter(this.products, function(product) {
                    return (filterBy.indexOf(product.availability) > -1);
                });
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
             * Makes sure the currently link is valid
             * (starts with http:// or https://)
             */
            Location.prototype.sanitiseLink = function() {
                if (angular.isString(this.link) &&
                    this.link.length > 0 &&
                    !/^https?:\/\//.test(this.link))
                {
                    this.link = 'http://' + this.link;
                }
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
                this.owner = newData.owner;
                this.name = newData.name;
                this.description = newData.description;
                this.link = newData.link;
                this.type = newData.type;
                this.points = newData.points;
                this.quality = newData.quality;
                this.effort = newData.effort;
                this.products = newData.products;
                this.updatedAt = newData.updatedAt;
                this._updateMarker();
                this.setLatLng(newData.lat, newData.lng);

                // Clear points memoiziation
                this._sortedPoints = undefined;

                // TODO: update the marker 'title'
            };

            return Location;
        }
    ]);
})(window.veganaut.mapModule);
