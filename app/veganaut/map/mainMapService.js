(function(module) {
    'use strict';
    module.factory('mainMapService', [
        '$q', '$rootScope', '$location', '$routeParams', '$route', '$timeout', 'Leaflet',
        'constants', 'Area', 'locationService', 'locationFilterService', 'areaService',
        function($q, $rootScope, $location, $routeParams, $route, $timeout, L,
            constants, Area, locationService, locationFilterService, areaService) {

            /**
             * Default and at the same time maximum zoom level used when
             * showing an area that doesn't have an explicit zoom set.
             * @type {number}
             */
            var DEFAULT_ZOOM = 4;

            /**
             * Name of the route where the main map is shown.
             * @type {string}
             */
            var MAP_ROUTE_NAME = 'map';

            /**
             * Service managing the main map. This mostly concerns the
             * storage and retrieval of the map center from different sources.
             * @constructor
             */
            var MainMapService = function() {
                var that = this;

                // Listen to filter changes
                $rootScope.$on('veganaut.filters.changed', function() {
                    // Only update when we are actually on the map page
                    if ($route.current.vgRouteName === MAP_ROUTE_NAME) {
                        that._reloadLocations();
                    }
                });

                // Listen to route changes to clean up URL
                $rootScope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
                    // If the event is still ongoing and we moved away from the map page,
                    // remove our params from the URL.
                    if (!event.defaultPrevented &&
                        angular.isObject(oldRoute) &&
                        oldRoute.vgRouteName === MAP_ROUTE_NAME &&
                        newRoute.vgRouteName !== MAP_ROUTE_NAME)
                    {
                        $location.search('zoom', undefined);
                        $location.search('coords', undefined);
                    }
                });
            };

            /**
             * Try to read the map center from the url hash
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

                // Try to set as current area
                areaService.setArea(new Area({
                    lat: lat,
                    lng: lng,
                    zoom: zoom
                }));
            };

            /**
             * Tells the location service to query for new locations based on the
             * currently shown map section
             * @private
             */
            MainMapService.prototype._reloadLocations = function() {
                areaService.getCurrentArea().then(function(area) {
                    // TODO: should make sure we have a bbox and zoom
                    locationService.queryByBounds(
                        area.getBoundingBox().toBBoxString(),
                        area.getZoom()
                    );
                });
            };

            /**
             * Updates the URL to represent the currently displayed map.
             * The zoom as well as the coordinates are set.
             */
            MainMapService.prototype._updateCenterInUrl = function() {
                areaService.getCurrentArea().then(function(area) {
                    var coords =
                        area.getLat().toFixed(constants.URL_FLOAT_PRECISION) + ',' +
                        area.getLng().toFixed(constants.URL_FLOAT_PRECISION);

                    // Replace the url params (without adding a new history item)
                    // Can't use $route.updateParams as this will set all params, not only the ones we want
                    // TODO: should make sure we have zoom
                    $location.replace();
                    $location.search('zoom', area.getZoom());
                    $location.search('coords', coords);
                });
            };

            /**
             * Shows the given area on the given map.
             * Tries different strategies depending how the area is defined.
             * @param {Area} area
             * @param {L.map} map
             * @private
             */
            MainMapService.prototype._showArea = function(area, map) {
                var zoom = area.getZoom();
                var lat = area.getLat();
                var lng = area.getLng();
                var boundingBox = area.getBoundingBox();

                // If zoom is not given, find other options to get the zoom
                if (!angular.isNumber(zoom)) {
                    if (angular.isObject(boundingBox)) {
                        // Check the bounding box first
                        // Find the center and zoom level we would go to with the bounding box
                        var boundingBoxCenter = boundingBox.getCenter();
                        var boundingBoxZoom = map.getBoundsZoom(boundingBox);

                        // Only set the bounding box based center if we wouldn't zoom out too far
                        // (e.g. the US bounding box is basically the whole world)
                        if (boundingBoxZoom >= DEFAULT_ZOOM) {
                            zoom = boundingBoxZoom;
                            lat = boundingBoxCenter.lat;
                            lng = boundingBoxCenter.lng;
                        }
                        else {
                            zoom = DEFAULT_ZOOM;
                        }
                    }
                    else {
                        // If no bounding box, try to get zoom from radius
                        var radius = area.getRadius();
                        if (angular.isNumber(radius) && isFinite(radius)) {
                            // Create a circle that is a bit smaller than the radius
                            // (fitting to bounds usually shows a bigger area than the bounds represent)
                            var circle = L.circle([lat, lng], radius * 0.8);
                            zoom = map.getBoundsZoom(circle.getBounds());
                        }
                        else {
                            // Otherwise fall back to default
                            zoom = DEFAULT_ZOOM;
                        }

                    }
                }
                map.setView([lat, lng], zoom);
            };

            /**
             * Initialises the main map by setting the filters, center and zoom.
             * If an area is provided in the URL, will set that as the current area.
             * It will then initialise the map based on the areaService's current area.
             */
            MainMapService.prototype.initialiseMap = function(map) {
                var that = this;
                var deferred = $q.defer();

                // Set the filters from the url first
                locationFilterService.setFiltersFromUrl();

                // Try setting from the URL hash
                this._setMapCenterFromUrl();

                // Get the area from the area service
                areaService.getCurrentArea()
                    .then(function(area) {
                        if (angular.isObject(area)) {
                            // Show the area and resolve the deferred
                            that._showArea(area, map);
                            deferred.resolve();
                        }
                    })
                    .catch(function() {
                        deferred.reject();
                    })
                ;

                return deferred.promise;
            };

            /**
             * Shows the current area on the map.
             * @param {L.map} map
             */
            MainMapService.prototype.showCurrentArea = function(map) {
                areaService.getCurrentArea().then(function(area) {
                    this._showArea(area, map);
                }.bind(this));
            };

            /**
             * Handler for changes to the center and zoom of the map.
             * The controller is responsible for calling this method.
             * @param {{}} newCenter
             */
            MainMapService.prototype.onCenterChanged = function(newCenter) {
                // Try to set the new center as area
                if (areaService.setArea(new Area(newCenter))) {
                    // Update url and locations if the area was valid
                    this._updateCenterInUrl();
                    this._reloadLocations();
                }
            };

            return new MainMapService();
        }
    ]);
})(window.veganaut.mapModule);
