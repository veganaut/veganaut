angular.module('veganaut.app.main').factory('Area', [
    'Leaflet', 'constants',
    function(L, constants) {
        'use strict';

        /**
         * Radius above which we consider the whole world to be included.
         * Compare also with WHOLE_WORLD_RADIUS.
         * @type {number} in meters
         */
        var MIN_RADIUS_TO_CONSIDER_WHOLE_WORLD = 10000000;

        /**
         * Model for storing an area (coordinates / zoom / bounding box).
         * @param {{}} [data]
         * @constructor
         */
        var Area = function(data) {
            data = data || {};

            /**
             *
             * @type {number}
             * @private
             */
            this._lat = data.lat;

            /**
             *
             * @type {number}
             * @private
             */
            this._lng = data.lng;

            /**
             *
             * @type {number}
             * @private
             */
            this._zoom = data.zoom;

            /**
             *
             * @type {L.latLngBounds}
             * @private
             */
            this._boundingBox = data.boundingBox;
            if (angular.isArray(this._boundingBox)) {
                this._boundingBox = L.latLngBounds(this._boundingBox);
            }

            /**
             *
             * @type {number}
             * @private
             */
            this._radius = data.radius;

            /**
             *
             * @type {string}
             */
            this.name = data.name;
        };

        /**
         * Checks whether this Area is valid. This means it has a full set of parameters
         * that define an area.
         * @returns {boolean}
         */
        Area.prototype.isValid = function() {
            var valid = false;

            // First, check if we have a valid lat and lng
            if (angular.isNumber(this._lat) && isFinite(this._lat) &&
                angular.isNumber(this._lng) && isFinite(this._lng))
            {
                // If we do, we either need a valid zoom or a valid radius
                if (angular.isNumber(this._zoom) && isFinite(this._zoom)) {
                    valid = true;
                }
                else if (angular.isNumber(this._radius) && isFinite(this._radius)) {
                    valid = true;
                }
            }

            // If we don't have lat/lng, we need valid bounding box. From this we can calculate everything else.
            if (angular.isObject(this._boundingBox) && angular.isFunction(this._boundingBox.toBBoxString)) {
                valid = true;
            }

            return valid;
        };

        /**
         * Returns the latitude of the center of this area.
         * Will always a number if this area is valid.
         * @returns {number|undefined}
         */
        Area.prototype.getLat = function() {
            if (angular.isNumber(this._lat) && isFinite(this._lat)) {
                return this._lat;
            }
            else if (angular.isObject(this._boundingBox)) {
                return this._boundingBox.getCenter().lat;
            }

            return undefined;
        };

        /**
         * Returns the longitude of the center of this area.
         * Will always a number if this area is valid.
         * @returns {number}
         */
        Area.prototype.getLng = function() {
            if (angular.isNumber(this._lng) && isFinite(this._lng)) {
                return this._lng;
            }
            else if (angular.isObject(this._boundingBox)) {
                return this._boundingBox.getCenter().lng;
            }

            return undefined;
        };

        /**
         * Returns the zoom (for the map) of this area. Can be undefined.
         * @returns {number|undefined}
         */
        Area.prototype.getZoom = function() {
            if (angular.isNumber(this._zoom) && isFinite(this._zoom)) {
                return Math.round(this._zoom);
            }

            return undefined;
        };

        /**
         * Returns the radius of this area. Can be undefined.
         * See also Area.getRadiusParams()
         * @returns {number|undefined} Radius in metres.
         */
        Area.prototype.getRadius = function() {
            if (angular.isNumber(this._radius) && isFinite(this._radius)) {
                return Math.round(this._radius);
            }

            return undefined;
        };

        /**
         * Returns the bounding box of this area. Can be undefined.
         * @returns {L.latLngBounds|undefined}
         */
        Area.prototype.getBoundingBox = function() {
            return this._boundingBox;
        };

        /**
         * Returns the center and radius that best represents this area.
         * @returns {{radius: number, includesWholeWorld: boolean, lat: number, lng: number}}
         */
        Area.prototype.getRadiusParams = function() {
            var params = {
                radius: this.getRadius(),
                lat: this.getLat(),
                lng: this.getLng()
            };

            // Check if we have an explicit radius set
            if (!angular.isNumber(params.radius) || !isFinite(params.radius)) {
                if (angular.isObject(this._boundingBox)) {
                    // If not, we try to get the radius anc center from the bounding box
                    var center = this._boundingBox.getCenter();
                    params = {
                        radius: this._getRadiusFromBounds(),
                        lat: center.lat,
                        lng: center.lng
                    };
                }
                else {
                    // If there is no bounding box either, we fall back to zoom-based radius.
                    params.radius = this._getRadiusFromZoom();
                }
            }

            // If the radius exceeds a certain amount, we say it includes the whole world
            params.includesWholeWorld = (params.radius > MIN_RADIUS_TO_CONSIDER_WHOLE_WORLD);

            // If the whole world is included, set default values
            if (params.includesWholeWorld) {
                params.radius = constants.WHOLE_WORLD_RADIUS;
                params.lat = 0;
                params.lng = 0;
            }

            return params;
        };

        /**
         * Returns the JSON representation of this area.
         * @returns {{}}
         */
        Area.prototype.toJSON = function() {
            var bbox = this._boundingBox;
            if (angular.isObject(bbox)) {
                bbox = [
                    [bbox.getSouth(), bbox.getWest()],
                    [bbox.getNorth(), bbox.getEast()]
                ];
            }
            return {
                lat: this._lat,
                lng: this._lng,
                zoom: this.getZoom(),
                radius: this.getRadius(),
                boundingBox: bbox
            };
        };


        /**
         * Returns the radius around the center of the bounding box that roughly
         * represents the same area as the bounding box.
         * TODO: add tests
         *
         * @returns {number} radius in meters
         * @private
         */
        Area.prototype._getRadiusFromBounds = function() {
            // Extract the dat from the bounds
            var center = this._boundingBox.getCenter();
            var north = this._boundingBox.getNorth();
            var south = this._boundingBox.getSouth();
            var east = this._boundingBox.getEast();
            var west = this._boundingBox.getWest();

            // Calculate the distance of the shown vertical space in meters
            // It is possible that not the whole map container is used to show the map, if one is zoomed out
            // very far. We want to get the most southern and most northern point on the map that is shown.
            var northernMostPoint = L.latLng(north, center.lng);
            var southernMostPoint = L.latLng(south, center.lng);

            // Get the vertical distance (in meters) by taking the distance from north to south
            var verticalDistance = northernMostPoint.distanceTo(southernMostPoint);

            // For the horizontal distance, we use a different technique:
            // We measure the width of the "widest" part of the map.
            // This has to be done because we cannot simply take the distance from the eastern most
            // point to the western most point, because the shortest path between those might be
            // going "the other way around" or because multiple "earths" might be shown.
            // The widest part of the map is the latitude that is closest to the equator. We first
            // find out what latitude this.
            var horizontalMeasureLat;
            if (north < 0) {
                // If the northern most point is below the equator, it's the closest to the equator
                horizontalMeasureLat = north;
            }
            else if (south > 0) {
                // If the southern most point is above the equator, it's the closest to the equator
                horizontalMeasureLat = south;
            }
            else {
                // Otherwise, the equator itself is withing the view
                horizontalMeasureLat = 0;
            }

            // For the longitude, we pick the center and the east side.
            var horizontalMeasureLng1 = center.lng;
            var horizontalMeasureLng2 = east;

            // Except if we are showing more than one earth. Then we measure at fixed longitudes
            var lngWidth = east - west;
            if (lngWidth > 360) {
                horizontalMeasureLng1 = 0;
                horizontalMeasureLng2 = 180;
            }

            // Take the distance between the two points we got the lat/lng for
            var horizontalDistance = L.latLng(horizontalMeasureLat, horizontalMeasureLng1)
                    .distanceTo(L.latLng(horizontalMeasureLat, horizontalMeasureLng2)) * 2;

            // If more than one whole world width is shown, scale it up
            if (lngWidth > 360) {
                horizontalDistance *= lngWidth / 360;
            }

            // Finally, we can pick a good radius by taking the average of the two distances
            var radius = (horizontalDistance + verticalDistance) / 4;
            return Math.round(radius);
        };

        /**
         * Returns the radius that roughly represents the area at a certain zoom level.
         * This is very inaccurate because it heavily depends on the size of the map shown
         * at this zoom level.
         * @returns {number}
         * @private
         */
        Area.prototype._getRadiusFromZoom = function() {
            // Get the zoom, falling back to 0 (zoomed all the way out)
            var zoom = this.getZoom() || 0;

            // Return approximate radius at that zoom for roughly a tablet-sized screen.
            // Formula was obtained empirically.
            return Math.pow(2, 18 - zoom) * 200;
        };

        return Area;
    }
]);
