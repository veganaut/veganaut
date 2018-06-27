(function(module) {
    'use strict';

    // TODO: This model is getting too big. The parts for the map should be separated from the rest.
    module.factory('Location', ['$rootScope', 'playerService', 'locationFilterService',
        function($rootScope, playerService, locationFilterService) {
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
             * Maximum weight of the location tags.
             * @type {number}
             */
            var MAX_TAG_WEIGHT = 4;

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

                /**
                 * Id of this location.
                 * A value of "new" signifies that this location is currently
                 * being created in the frontend and is not yet stored.
                 * @type {string}
                 */
                this.id = 'new';
                this.lat = undefined;
                this.lng = undefined;
                this.name = undefined;
                this.description = undefined;
                this.website = undefined;
                this.type = undefined;
                this.address = undefined;
                this.quality = {
                    average: 0,
                    numRatings: 0
                };
                this.products = [];
                this.updatedAt = undefined;

                // Rank of the best product of this location. Only set on the map views showing products
                this.topProductRank = undefined;

                this._isBeingEdited = false;

                /**
                 * Product that should be shown as the only one of that location.
                 * Used for the product list view where only one product is highlighted
                 * @type {{}}
                 * @private
                 */
                this._shownProduct = undefined;

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
                 * Defines all the properties for the Leaflet marker to
                 * represent this location.
                 * @type {{}}
                 * @private
                 */
                this._markerDefinition = undefined;

                // Apply the given data (will also set marker definition)
                this.update(jsonData);

                // Update the marker once we got the player info (to set correct ownership after login)
                playerService.getDeferredMe().then(function() {
                    this.updateMarker();
                }.bind(this));
            }

            /**
             * Icon name used for the type of location
             * @type {{gastronomy: string, retail: string}}
             * @private
             */
            Location._NAME_FOR_TYPE = {
                // TODO: this should be a directive
                gastronomy: 'gastronomyLocation',
                retail: 'retailLocation'
            };

            /**
             * Returns the icon name for the given location type.
             * Returns false if no valid type is given.
             * @param {string} type
             * @returns {string|boolean}
             */
            Location.getIconNameForType = function(type) {
                var name = Location._NAME_FOR_TYPE[type];
                if (angular.isString(name)) {
                    return name;
                }
                return false;
            };


            /**
             * Returns the marker definition to be used for this location.
             * The event 'veganaut.locationItem.marker.updated' will be broadcast
             * when the definition changes.
             * @returns {{}}
             */
            Location.prototype.getMarkerDefinition = function() {
                return this._markerDefinition;
            };

            /**
             * Get the list of class names to be used for the marker icon.
             * @returns {string}
             */
            Location.prototype._getMarkerIconClasses = function() {
                // Compose the icon class name
                return 'marker' +
                    ' marker--type-' + this.type +
                    ' marker--prominence-' + Math.round(this._getProminence()) +
                    (this._disabled ? ' marker--disabled' : ' marker--enabled') +
                    (this._active ? ' marker--active' : '') +
                    (this._isBeingEdited ? ' marker--editing' : '');
            };

            /**
             * Gets the zIndexOffset that should be used for this location's marker
             * @returns {number}
             */
            Location.prototype._getMarkerZIndexOffset = function() {
                // Calculate the z-index offset:
                // Higher quality locations should be more in front. We take 2
                // decimal places of the average too have more layers than just
                // the rounded average. We then make sure the last 3 digits are
                // always 0. Those will be used by Leaflet to set a latitude
                // based offset.
                // TODO: add a test for this
                var zIndexOffset = Math.max(100000, Math.round(this._getProminence() * 100) * 1000);

                // Active markers should be in front of all others (except hover)
                if (this._active) {
                    zIndexOffset = Z_INDEX_OFFSET_ACTIVE;
                }

                // Special z-index when disabled
                if (this._disabled) {
                    zIndexOffset = Z_INDEX_OFFSET_DISABLED;
                }

                return zIndexOffset;
            };

            /**
             * Gets a number representing how prominently this location should be
             * displayed on the map.
             * Depending on whether the focus is on the location or the products,
             * uses the location quality or top product rating (rank).
             * @returns {number} A (decimal) number between 0 and 5
             * @private
             */
            Location.prototype._getProminence = function() {
                var prominence;
                if (locationFilterService.getGranularityFilterValue() === 'product') {
                    prominence = this.topProductRank;
                }
                else {
                    // TODO: Use the quality rank, not average once the backend sends that
                    prominence = this.quality.average;
                }
                return Math.min(5, Math.max(0, prominence || 0));
            };

            /**
             * Updates the marker definition of this location.
             * If the marker has changed, broadcasts an event letting all the shown
             * markers know they should get the newest marker definition.
             */
            Location.prototype.updateMarker = function() {
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
                        clickable: true,
                        riseOnHover: true,
                        riseOffset: Z_INDEX_OFFSET_HOVER
                    },
                    icon: {
                        iconSize: null, // Needs to be set to null so it can be specified in CSS
                        className: this._getMarkerIconClasses()
                    },
                    zIndexOffset: this._getMarkerZIndexOffset()
                };

                // Send updated event if it changed (but not if it was previously undefined;
                // in this case the location is just being initialised).
                if (angular.isObject(oldDefinition) && !_.isEqual(oldDefinition, this._markerDefinition)) {
                    $rootScope.$broadcast('veganaut.locationItem.marker.updated', this);
                }
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
                this.updateMarker();
            };

            /**
             * Sets the location as active or inactive
             * @param {boolean} [isActive=true]
             */
            Location.prototype.setActive = function(isActive) {
                if (typeof isActive === 'undefined') {
                    isActive = true;
                }
                this._active = !!isActive;
                this.updateMarker();
            };

            /**
             * Sets whether this location is currently being edited
             * @param {boolean} [isEditing=true]
             */
            Location.prototype.setEditing = function(isEditing) {
                if (typeof isEditing === 'undefined') {
                    isEditing = true;
                }
                this._isBeingEdited = !!isEditing;
                this.updateMarker();
            };

            /**
             * Whether the location is active
             * @returns {boolean}
             */
            Location.prototype.isActive = function() {
                return this._active;
            };

            /**
             * Sets the location to be disabled or enabled on the map.
             * Disabled locations are shown greyed out.
             * @param {boolean} [isDisabled=true]
             * TODO: disabled is unused now that filters are done in the backend, remove?
             */
            Location.prototype.setDisabled = function(isDisabled) {
                if (typeof isDisabled === 'undefined') {
                    isDisabled = true;
                }
                this._disabled = !!isDisabled;
                this.updateMarker();
            };

            /**
             * Returns whether the location is disabled
             * @returns boolean
             */
            Location.prototype.isDisabled = function() {
                return this._disabled;
            };

            /**
             * Returns the list of tags of this location sorted by number of votes.
             * @returns {[]}
             */
            Location.prototype.getSortedTags = function() {
                // TODO: should be possible to clear the memoiziation

                // Get the max rating that should be at least 4 (if there are less ratings,
                // we want to show the tag less strongly)
                var maxRating = _.reduce(this.tags, function(max, value) {
                    return Math.max(max, (angular.isNumber(value) ? value : 0));
                }, MAX_TAG_WEIGHT);

                this._sortedTags = this._sortedTags ||  _.chain(this.tags)
                    .map(function(value, tagName) {
                        // Calculate a weight between 1 and MAX_TAG_WEIGHT
                        var weight = 1;
                        if (angular.isNumber(value)) {
                            weight = Math.ceil(value / maxRating * MAX_TAG_WEIGHT);
                        }
                        return {name: tagName, weight: weight};
                    })
                    .sortByOrder(['weight', 'name'], ['desc', 'asc'])
                    .value()
                ;
                return this._sortedTags;
            };

            /**
             * Sets the given product to be shown as the only one of this location.
             * Call without arguments to reset.
             * @param {{}} product
             */
            Location.prototype.setShownProduct = function(product) {
                this._shownProduct = product;
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
             * @private
             */
            Location.prototype._getProductsByAvailability = function(filterBy) {
                if (angular.isString(filterBy)) {
                    filterBy = [filterBy];
                }
                return _.filter(this.products, function(product) {
                    return (filterBy.indexOf(product.availability) > -1);
                });
            };

            /**
             * Get the products that should be displayed for this location
             * @param {boolean} [showUnavailable=false] Whether to also include unavailable products.
             *      By default only available and temporarilyUnavailable products are shown.
             * @returns {Product[]}
             */
            Location.prototype.getProducts = function(showUnavailable) {
                if (this._shownProduct) {
                    // If there is a shown product set, return only that
                    return [this._shownProduct];
                }
                if (showUnavailable) {
                    return this.products;
                }
                return this._getProductsByAvailability(['always', 'sometimes', 'daily', 'weekly', 'seasonal']);
            };

            /**
             * Whether this location has an products that are unavailable
             * @returns {boolean}
             */
            Location.prototype.hasUnavailableProducts = function() {
                return (this._getProductsByAvailability('not').length > 0);
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
             * Returns the description limited to a certain length
             * TODO: Add unit test? Or will this anyway be done by the backend somehow?
             * TODO: this should be a filter
             * @returns {string}
             */
            Location.prototype.getShortDescription = function() {
                var desc = this.description;

                // If there is no description, return empty
                if (!angular.isString(desc)) {
                    return '';
                }

                // Limit if longer than certain length
                var MAX_LENGTH = 160;
                if (desc.length > MAX_LENGTH) {
                    // Find the last space to not cut words
                    desc = desc.substring(0, MAX_LENGTH);
                    var lastSpace = desc.lastIndexOf(' ');
                    if (lastSpace !== -1) {
                        desc = desc.substring(0, lastSpace);
                    }

                    // Add an ellipsis
                    desc += '…';
                }
                return desc.replace(/\n[\n ]*/g, '; ');
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
             * Adds "http://" to the URL if not already present
             * (starts with http:// or https://)
             * TODO: move somewhere else
             * @param url
             * @returns {string}
             */
            Location.prototype.sanitiseUrl = function(url) {
                if (angular.isString(url) &&
                    url.length > 0 &&
                    !/^https?:\/\//.test(url))
                {
                    return 'http://' + url;
                }
                return url;
            };

            /**
             * Returns the short address part to display based on the passed address type.
             * @param {string} addressType Detail of address to show, either 'street' or 'city'
             * @returns {string|undefined}
             */
            Location.prototype.getDisplayAddress = function(addressType) {
                var address;
                if (angular.isObject(this.address)) {
                    // Check if we should display the street or city
                    if (addressType === 'street' && angular.isString(this.address.street)) {
                        address = this.address.street;

                        // Add house number if present
                        if (angular.isString(this.address.house)) {
                            address += ' ' + this.address.house;
                        }
                    }
                    else if (addressType === 'city' && angular.isString(this.address.city)) {
                        address = this.address.city;
                    }
                }
                return address;
            };

            /**
             * Updates this Location with the new data loaded from the backend
             * @param {{}} newData Raw (not instantiated Location!) data from the backend
             */
            Location.prototype.update = function(newData) {
                // TODO: this should deep copy, otherwise quality might not have a valid value
                _.assign(this, newData || {});

                // Clear memoiziations
                this._sortedPoints = undefined;
                this._sortedTags = undefined;

                // Instantiate the date
                if (!angular.isDate(this.updatedAt)) {
                    this.updatedAt = new Date(this.updatedAt);
                }

                // Update the marker
                this.updateMarker();
            };

            return Location;
        }
    ]);
})(window.veganaut.mapModule);
