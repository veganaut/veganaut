(function(module) {
    'use strict';
    module.factory('mainMapService', [
        '$window', '$location', '$timeout', 'Leaflet', 'leafletData', 'backendService', 'locationFilterService',
        function($window, $location, $timeout, L, leafletData, backendService, locationFilterService) {

            // TODO: the management of the URL hash should be extracted to a separate service

            /**
             * Default zoom used when no one provided a zoom level
             * @type {number}
             */
            var DEFAULT_ZOOM = 2;

            /**
             * Zoom level used when the backend provides the zoom level
             * based on the IP address
             * @type {number}
             */
            var GEO_IP_ZOOM = 10;

            /**
             * Local storage id used for storing the current map center
             * @type {string}
             */
            var MAP_CENTER_STORAGE_ID = 'veganautMapCenter';

            /**
             * How many digits after the decimal point should be considered for lat/lng
             * @type {number}
             */
            var FLOAT_PRECISION = 7;

            // Regex for parsing the URL hash
            // Hash is in the form: zoom:11,coords:46.9767388-7.6516342,type:retail
            var ZOOM_REGEX = /(?:^|,)zoom:([0-9]+)(?:,|$)/;
            var COORDINATES_REGEX = /(?:^|,)coords:(-?[0-9\.]+)-(-?[0-9\.]+)(?:,|$)/;
            var TYPE_FILTER_REGEX = /(?:^|,)type:([a-z]+)(?:,|$)/;

            /**
             * Service managing the main map. This mostly concerns the
             * storage and retrieval of the map center from different sources.
             * @constructor
             */
            var MainMapService = function() {
                /**
                 * Current center of the map
                 * @type {{lat: number, lng: number, zoom: number}}
                 */
                this.center = {
                    lat: 0,
                    lng: 0,
                    zoom: DEFAULT_ZOOM
                };

                // Initialise map center and location type filter
                this._initialiseMapCenter();
                this._setTypeFilterFromUrl();
            };

            /**
             * Sets the map center either from the url hash, local storage or
             * from asking the backend for a location
             * @private
             */
            MainMapService.prototype._initialiseMapCenter = function() {
                var that = this;

                // Try setting from the URL hash
                var centerSet = that._setMapCenterFromUrl();

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
            MainMapService.prototype._setMapCenterIfValid = function(lat, lng, zoom) {
                if (angular.isNumber(lat) && isFinite(lat) &&
                    angular.isNumber(lng) && isFinite(lat) &&
                    angular.isNumber(zoom) && isFinite(lat))
                {
                    // Only set new coords if either not defined or significantly enough different
                    if (!angular.isNumber(this.center.lat) ||
                        this.center.lat.toFixed(FLOAT_PRECISION) !== lat.toFixed(FLOAT_PRECISION))
                    {
                        this.center.lat = lat;
                    }
                    if (!angular.isNumber(this.center.lng) ||
                        this.center.lng.toFixed(FLOAT_PRECISION) !== lng.toFixed(FLOAT_PRECISION))
                    {
                        this.center.lng = lng;
                    }

                    // Set zoom
                    this.center.zoom = zoom;

                    // Save the center, but don't update the url
                    this.saveCenter(false);
                    return true;
                }
                return false;
            };

            /**
             * Try to read the map center from local storage
             * @returns {boolean} Whether the center was set
             * @private
             */
            MainMapService.prototype._setMapCenterFromLocalStorage = function() {
                var center = JSON.parse($window.localStorage.getItem(MAP_CENTER_STORAGE_ID) || '{}');
                return this._setMapCenterIfValid(center.lat, center.lng, center.zoom);
            };

            /**
             * Try to read the map center from the url hash
             * @returns {boolean} Whether the center was set
             * @private
             */
            MainMapService.prototype._setMapCenterFromUrl = function() {
                var hash = $location.hash();
                var zoom, lat, lng;

                var match = ZOOM_REGEX.exec(hash);
                if (match) {
                    // Found zoom value
                    zoom = parseInt(match[1], 10);
                }

                match = COORDINATES_REGEX.exec(hash);
                if (match) {
                    lat = parseFloat(match[1]);
                    lng = parseFloat(match[2]);
                }

                return this._setMapCenterIfValid(lat, lng, zoom);
            };

            /**
             * Sets the location type filter from the URL hash.
             * @private
             */
            MainMapService.prototype._setTypeFilterFromUrl = function() {
                var match = TYPE_FILTER_REGEX.exec($location.hash());
                if (match) {
                    if (locationFilterService.POSSIBLE_FILTERS.type.indexOf(match[1]) >= 0) {
                        // Found valid location type filter
                        locationFilterService.activeFilters.type = match[1];
                    }
                    else {
                        // Invalid type, reset to inactive
                        locationFilterService.activeFilters.type = locationFilterService.INACTIVE_FILTER_VALUE.type;

                        // Update the URL to make sure it's always well-formed
                        this.updateUrl();
                    }
                }
            };

            /**
             * Sets all the map settings stored in the URL.
             */
            MainMapService.prototype.setMapFromUrl = function() {
                // Set center and type filter
                this._setMapCenterFromUrl();
                this._setTypeFilterFromUrl();
            };

            /**
             * Saves the map center in local storage and in the url
             * @param {boolean} [updateUrl=true] Whether to update the URL
             *      after saving to local storage
             */
            MainMapService.prototype.saveCenter = function(updateUrl) {
                // Store it in local storage
                $window.localStorage.setItem(MAP_CENTER_STORAGE_ID,
                    JSON.stringify(this.center)
                );

                // Check if we should update the url (defaults to true)
                if (updateUrl !== false) {
                    this.updateUrl();
                }
            };

            /**
             * Updates the URL hash to represent the currently displayed map.
             * The URL will contain the zoom, coordinates as well as the
             * location type filter value.
             */
            MainMapService.prototype.updateUrl = function() {
                // Add zoom and coords to the hash
                var hash =
                    'zoom:' +
                    this.center.zoom +
                    ',coords:' +
                    this.center.lat.toFixed(FLOAT_PRECISION) + '-' +
                    this.center.lng.toFixed(FLOAT_PRECISION);

                // Add type filter if active
                if (locationFilterService.activeFilters.type !== locationFilterService.INACTIVE_FILTER_VALUE.type) {
                    hash += ',type:' + locationFilterService.activeFilters.type;
                }

                // Replace the url hash (without adding a new history item)
                $location.replace();
                $location.hash(hash);
            };

            /**
             * Redirects to the location list that will show a locations within a radius from
             * a center that is picked from the current map view.
             * TODO: Add a wrapper for the leaflet map instance with helper methods.
             * TODO: add tests once this method is more split up
             * @param {number} headerSize Size of the header (under which the map is shown,
             *      but should not be considered for the radius and center calculation)
             */
            MainMapService.prototype.goToLocationList = function(headerSize) {
                leafletData.getMap().then(function(map) {
                    // Get the size of the map area in pixels
                    var containerSizePixel = map.getSize();

                    // Get the center around which we want to show the locations
                    // This is the point in the center of the visible part of the map
                    // (remember that the actual map goes under the header).
                    var adjustedCenter = map.containerPointToLatLng([containerSizePixel.x / 2, (containerSizePixel.y + headerSize) / 2]);

                    // Calculate the distance of the shown vertical space in meters
                    // It is possible that not the whole map container is used to show the map, if one is zoomed out
                    // very far. We want to get the most southern and most northern point on the map that is shown.
                    // First we find out the pixel coordinates of the poles
                    var northPole = L.latLng(90, 0);
                    var southPole = L.latLng(-90, 0);
                    var northPolePixel = map.latLngToContainerPoint(northPole);
                    var southPolePixel = map.latLngToContainerPoint(southPole);

                    // In most cases, the height of the map  is the height of the container (minus the header)
                    var mapHeightPixel = containerSizePixel.y - headerSize;

                    // The northern most point is either the north pole, or the point just at the header size
                    var northernMostPoint;
                    if (northPolePixel.y > headerSize) {
                        // The north pole is visible, set that as the northern most point
                        northernMostPoint = northPole;

                        // Above the north pole, there might be empty space that we don't want to count)
                        mapHeightPixel -= (northPolePixel.y - headerSize);
                    }
                    else {
                        // North pole is not visible, so northern most point is just at the header size
                        northernMostPoint = map.containerPointToLatLng([0, headerSize]);
                    }

                    // Same thing for the southern most point, except that we don't account for the header
                    var southernMostPoint;
                    if (southPolePixel.y < containerSizePixel.y) {
                        southernMostPoint = southPole;
                        mapHeightPixel -= (containerSizePixel.y - southPolePixel.y);
                    }
                    else {
                        southernMostPoint = map.containerPointToLatLng([0, containerSizePixel.y]);
                    }

                    // Finally, get the vertical distance (in meters) by taking the distance from north to south
                    var verticalDistance = northernMostPoint.distanceTo(southernMostPoint);

                    // If not the whole vertical space was used up by the map, scale up the distance
                    // to get how many meters would fit in the whole map area.
                    verticalDistance = (verticalDistance / mapHeightPixel) * (containerSizePixel.y - headerSize);


                    // For the horizontal distance, we use a different technique:
                    // We measure how many meters fit in 100 pixels at the "widest" part of the map.
                    // This has to be done because we cannot simply take the distance from the eastern most
                    // point to the western most point, because the shortest path between those might be
                    // going "the other way around" or because multiple "earths" might be shown.
                    // The widest part of the map is the latitude that is closest to the equator. We first
                    // find out what latitude this is and pick a point on it.
                    var horizontalPoint1;
                    if (northernMostPoint.lat < 0) {
                        // If the northern most point is below the equator, it's the closest to the equator
                        horizontalPoint1 = L.latLng(northernMostPoint.lat, 0);
                    }
                    else if (southernMostPoint.lat > 0) {
                        // If the southern most point is above the equator, it's the closest to the equator
                        horizontalPoint1 = L.latLng(southernMostPoint.lat, 0);
                    }
                    else {
                        // Otherwise, the equator itself is withing the view
                        horizontalPoint1 = L.latLng(0, 0);
                    }

                    // Convert to pixel coordinates
                    var horizontalPoint1Pixel = map.latLngToContainerPoint(horizontalPoint1);

                    // Get a second point, 100 pixels east of the first point
                    var horizontalPoint2 = map.containerPointToLatLng([horizontalPoint1Pixel.x + 100, horizontalPoint1Pixel.y]);

                    // Take the distance between these two points and scale up to the whole container size
                    var horizontalDistance = (horizontalPoint1.distanceTo(horizontalPoint2) / 100) * containerSizePixel.x;

                    // Finally, we can pick a good radius by choosing the smaller of the two distances
                    var radius = Math.min(horizontalDistance, verticalDistance) / 2;


                    // Show the rough area that was selected on the map.
                    // We draw the biggest circle that fully fits in the current map view.
                    // This is done in pixel-coordinates since if we get close to the poles and are zoomed out
                    // quite far, the map coordinate circle are getting way too big.
                    // Note that the further we are zoomed out and the further we get to the poles, this
                    // approximation of drawing a circle on a mercator projection to show an area within a certain
                    // radius around a point of the sphere gets more and more imprecise.
                    // TODO: try to draw the actual projection of the circle
                    var circleMarker = L.circleMarker(adjustedCenter, {
                        className: 'geolocate-circle-marker'
                    });
                    var radiusPixel = Math.min(containerSizePixel.x, containerSizePixel.y - headerSize) / 2;
                    circleMarker.setRadius(radiusPixel);
                    circleMarker.addTo(map);

                    // Redirect after a bit
                    $timeout(function() {
                        // Remove the circle marker again
                        map.removeLayer(circleMarker);

                        // TODO: already start loading the locations now for the location list
                        $location
                            .path('list/locations/')
                            .search('lat', adjustedCenter.lat.toFixed(FLOAT_PRECISION))
                            .search('lng', adjustedCenter.lng.toFixed(FLOAT_PRECISION))
                            .search('radius', radius.toFixed(0))
                        ;
                    }, 500);
                });
            };

            return new MainMapService();
        }
    ]);
})(window.veganaut.mapModule);
