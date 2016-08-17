(function(module) {
    'use strict';
    module.factory('mainMapService', [
        '$window', '$location', '$route', '$routeParams', '$timeout', 'Leaflet',
        'leafletData', 'backendService', 'locationService', 'locationFilterService',
        function($window, $location, $route, $routeParams, $timeout, L,
            leafletData, backendService, locationService, locationFilterService) {

            /**
             * Default zoom level used when showing a given place.
             * Used for example when the backend provides a place based
             * on the IP
             * @type {number}
             */
            var DEFAULT_ZOOM = 4;

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

            /**
             * Service managing the main map. This mostly concerns the
             * storage and retrieval of the map center from different sources.
             * @constructor
             */
            var MainMapService = function() {
                /**
                 * The center that we last stored (in the URL and local storage).
                 * This needs to be tracked separately from the center that Leaflet
                 * provides to keep everything in sync correctly.
                 * @type {{lat: number, lng: number, zoom: number}}
                 * @private
                 */
                this._lastStoredCenter = {
                    // Defaults correspond to the ones set in mainMap.tpl.html
                    lat: 0,
                    lng: 0,
                    zoom: 2
                };

                /**
                 * Target place that will try to be shown when the map is next loaded.
                 * @type {{}}
                 * @private
                 */
                this._targetPlace = undefined;
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
                    angular.isNumber(lng) && isFinite(lng) &&
                    angular.isNumber(zoom) && isFinite(zoom))
                {
                    leafletData.getMap().then(function(map) {
                        var changed = false;
                        // Only set new coords if either not defined or significantly enough different
                        // We compare to the last stored center because it is possible that Leaflet
                        // doesn't exactly go to the coords we wanted. To prevent looping updated, we compare
                        // to what we last wanted to set it to.
                        var newLat = this._lastStoredCenter.lat;
                        if (!angular.isNumber(newLat) || newLat.toFixed(FLOAT_PRECISION) !== lat.toFixed(FLOAT_PRECISION)) {
                            changed = true;
                            newLat = lat;
                        }

                        var newLng = this._lastStoredCenter.lng;
                        if (!angular.isNumber(newLng) || newLng.toFixed(FLOAT_PRECISION) !== lng.toFixed(FLOAT_PRECISION)) {
                            changed = true;
                            newLng = lng;
                        }

                        var newZoom = this._lastStoredCenter.zoom;
                        if (!angular.isNumber(newZoom) || newZoom !== zoom) {
                            changed = true;
                            newZoom = zoom;
                        }

                        if (changed) {
                            // Set the new center (directly through leaflet to only fire
                            // the reload of locations once the view is set).
                            map.setView([newLat, newLng], newZoom);
                        }
                    }.bind(this));

                    // The passed center looked valid (and we will set it soon)
                    return true;
                }

                // Passed center is not valid
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
                var rawZoom = $routeParams.zoom || '';
                var rawCoords = $routeParams.coords || '';
                var zoom, lat, lng;

                // Parse the raw zoom
                zoom = parseInt(rawZoom, 10);

                // Parse the coordinates
                var splitCoords = rawCoords.split(',');
                if (splitCoords.length === 2) {
                    lat = parseFloat(splitCoords[0]);
                    lng = parseFloat(splitCoords[1]);
                }

                return this._setMapCenterIfValid(lat, lng, zoom);
            };

            /**
             * Parses and sets all the filters from the URL.
             * @private
             */
            MainMapService.prototype._setFiltersFromUrl = function() {
                // TODO: don't duplicate, make generic
                if ($routeParams.type) {
                    // By default set the inactive value (if invalid value was given)
                    var typeFilter = locationFilterService.INACTIVE_FILTER_VALUE.type;
                    if (locationFilterService.POSSIBLE_FILTERS.type.indexOf($routeParams.type) >= 0) {
                        // Found valid location type filter
                        typeFilter = $routeParams.type;
                    }

                    // Set the new value
                    locationFilterService.activeFilters.type = typeFilter;
                }

                if ($routeParams.recent) {
                    // By default set the inactive value (if invalid value was given)
                    var recentFilter = locationFilterService.INACTIVE_FILTER_VALUE.recent;
                    if (locationFilterService.POSSIBLE_FILTERS.recent.indexOf($routeParams.recent) >= 0) {
                        // Found valid recent filter
                        recentFilter = $routeParams.recent;
                    }

                    // Set the new value
                    locationFilterService.activeFilters.recent = recentFilter;
                }

                // Update the URL to make sure it's always well-formed
                this._updateFiltersInUrl();
            };

            /**
             * Tells the location service to query for new locations based on the
             * currently shown map section
             * @private
             */
            MainMapService.prototype._reloadLocations = function() {
                leafletData.getMap().then(function(map) {
                    // Get the bounds and zoom level of the map and query the locations
                    // Note: we should use the _lastStoredCenter, but there is no easy way
                    // to get the bounding box from that.
                    locationService.queryByBounds(map.getBounds().toBBoxString(), map.getZoom());
                });
            };

            /**
             * Updates the URL params to correctly reflect the currently active filters.
             * @private
             */
            MainMapService.prototype._updateFiltersInUrl = function() {
                var typeFilter;
                if (locationFilterService.activeFilters.type !== locationFilterService.INACTIVE_FILTER_VALUE.type) {
                    typeFilter = locationFilterService.activeFilters.type;
                }

                var recentFilter;
                if (locationFilterService.activeFilters.recent !== locationFilterService.INACTIVE_FILTER_VALUE.recent) {
                    recentFilter = locationFilterService.activeFilters.recent;
                }

                // Replace the url hash (without adding a new history item)
                $location.replace();
                $route.updateParams({
                    type: typeFilter,
                    recent: recentFilter
                });
            };

            /**
             * Updates the URL to represent the currently displayed map.
             * The zoom as well as the coordinates are set.
             */
            MainMapService.prototype._updateCenterInUrl = function() {
                var coords =
                    this._lastStoredCenter.lat.toFixed(FLOAT_PRECISION) + ',' +
                    this._lastStoredCenter.lng.toFixed(FLOAT_PRECISION);

                // Replace the url hash (without adding a new history item)
                $location.replace();
                $route.updateParams({
                    zoom: this._lastStoredCenter.zoom,
                    coords: coords
                });
            };

            MainMapService.prototype._showPlace = function(place) {
                var targetZoom = place.zoom || DEFAULT_ZOOM;
                var targetLat = place.lat;
                var targetLng = place.lng;

                // For a better fit, we try to get the bounding box
                if (_.isArray(place.boundingBox)) {
                    leafletData.getMap().then(function(map) {
                        // Find the center and zoom level we would go to with the bounding box
                        var bounds = L.latLngBounds(place.boundingBox);
                        var boundingBoxCenter = bounds.getCenter();
                        var boundingBoxZoom = map.getBoundsZoom(bounds);

                        // Only set the bounding box based center if we wouldn't zoom out too far
                        // (e.g. the US bounding box is basically the whole world)
                        if (boundingBoxZoom >= DEFAULT_ZOOM) {
                            targetZoom = boundingBoxZoom;
                            targetLat = boundingBoxCenter.lat;
                            targetLng = boundingBoxCenter.lng;
                        }

                        // Set the center
                        this._setMapCenterIfValid(targetLat, targetLng, targetZoom);
                    }.bind(this));
                }
                else {
                    // If no bounding box given, set the center directly
                    this._setMapCenterIfValid(targetLat, targetLng, targetZoom);
                }
            };

            /**
             * Initialises the main map by setting the filters, center and zoom.
             * Different strategies are tried for the center in this order:
             *  - If a target location was set, then that is loaded. No other strategy is tried.
             *  - From the URL
             *  - From local storage
             *  - By asking the backend for a location (based in the user's IP)
             */
            MainMapService.prototype.initialiseMap = function() {
                // Set the filters from the url first
                this._setFiltersFromUrl();

                var centerSet = false;
                if (angular.isObject(this._targetPlace)) {
                    centerSet = true;

                    // Show the place and reset the target
                    this._showPlace(this._targetPlace);
                    this._targetPlace = undefined;
                }

                // Try setting from the URL hash
                if (!centerSet) {
                    centerSet = this._setMapCenterFromUrl();
                }

                // Try to load from center from local storage
                if (!centerSet) {
                    centerSet = this._setMapCenterFromLocalStorage();
                }

                // Finally, ask the backend for a center
                if (!centerSet) {
                    backendService.getGeoIP().then(function(geoIp) {
                        // Show the received place
                        this._showPlace(geoIp.data);
                    }.bind(this));
                }
            };

            /**
             * Set the location that the main map will try to show the next time it's loaded.
             * The targetPlace parameter must have a lat and a lng property and can have
             * a zoom and/or a boundingBox property.
             * @param {{}} targetPlace
             */
            MainMapService.prototype.setTargetPlace = function(targetPlace) {
                this._targetPlace = targetPlace;
            };

            /**
             * Handler for changes to the center and zoom of the map.
             * The controller is responsible for calling this method.
             * @param {{}} newCenter
             */
            MainMapService.prototype.onCenterChanged = function(newCenter) {
                // Check if something actually changed
                if (newCenter.lat !== this._lastStoredCenter.lat ||
                    newCenter.lng !== this._lastStoredCenter.lng ||
                    newCenter.zoom !== this._lastStoredCenter.zoom)
                {
                    this._lastStoredCenter.lat = newCenter.lat;
                    this._lastStoredCenter.lng = newCenter.lng;
                    this._lastStoredCenter.zoom = newCenter.zoom;

                    // Store it in local storage
                    $window.localStorage.setItem(MAP_CENTER_STORAGE_ID,
                        JSON.stringify(this._lastStoredCenter)
                    );

                    this._updateCenterInUrl();
                    this._reloadLocations();
                }
            };

            /**
             * Handler for changes in the filter settings.
             * The controller is responsible for calling this method.
             */
            MainMapService.prototype.onFiltersChanged = function() {
                this._updateFiltersInUrl();
                this._reloadLocations();
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
