(function(module) {
    'use strict';
    module.factory('mainMapService', [
        '$rootScope', '$route', '$location', 'Leaflet', 'Area', 'locationService',
        'locationFilterService', 'areaService', 'pageTitleService',
        function($rootScope, $route, $location, L, Area, locationService,
            locationFilterService, areaService, pageTitleService)
        {
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

                /**
                 * The area shown on the map might be different than the one from the
                 * areaService as we can't fit the area perfectly. We store the area that
                 * we are actually showing for the current area from the service here, as
                 * we don't want to overwrite the area with id on the service. We only
                 * overwrite the are in the service, if the user really moves the map.
                 *
                 * @type {Area}
                 * @private
                 */
                that._mapAreaForCurrentArea = undefined;

                /**
                 * Whether to start adding a location the next time the map is initialised
                 * @type {boolean}
                 * @private
                 */
                that._onMapInitialiseStartAddLocation = false;

                // Listen to filter changes
                $rootScope.$on('veganaut.filters.changed', function() {
                    // Only update when we are actually on the map page
                    if ($route.current.vgRouteName === MAP_ROUTE_NAME) {
                        that._reloadLocations();
                    }
                });

                $rootScope.$on('veganaut.area.changed', function() {
                    // When a new area is just pushed, we no longer know which area
                    // corresponds to it on the map.
                    that._mapAreaForCurrentArea = undefined;
                });
            };

            /**
             * Tells the location service to query for new locations based on the
             * currently shown map section
             * @private
             */
            MainMapService.prototype._reloadLocations = function() {
                if (this._mapAreaForCurrentArea) {
                    locationService.queryByBounds(
                        this._mapAreaForCurrentArea.getBoundingBox().toBBoxString(),
                        this._mapAreaForCurrentArea.getZoom()
                    );
                }
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

                // If the area has an id (so was explicitly set), add its name ot the page title
                if (area.getAreaType() === 'withId') {
                    pageTitleService.addCustomTitle(area.longName);
                }

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
             * @param {L.map} map
             */
            MainMapService.prototype.initialiseMap = function(map) {
                var that = this;

                // Reset map area
                that._mapAreaForCurrentArea = undefined;

                // Set the filters from the url first
                locationFilterService.setFiltersFromUrl();

                // Try to set the area from the URL params
                areaService.setAreaFromUrl()
                    .finally(function() {
                        // Initialise with the current area (regardless of whether the area was set from the URL)
                        that.showCurrentArea(map);

                        // Check if we should start adding a location right away
                        if (that._onMapInitialiseStartAddLocation) {
                            // Reset, to not add a location again next time
                            that._onMapInitialiseStartAddLocation = false;

                            // Broadcast that a location should start to be added
                            $rootScope.$broadcast('veganaut.location.startAddLocation');
                        }
                    })
                ;
            };

            /**
             * Shows the current area on the map.
             * @param {L.map} map
             */
            MainMapService.prototype.showCurrentArea = function(map) {
                this._showArea(areaService.getCurrentArea(), map);
            };

            /**
             * Navigate to the main map page and start the add location flow.
             */
            MainMapService.prototype.goToMapAndAddLocation = function() {
                // Check if we are already on the map page
                if ($route.current.vgRouteName === MAP_ROUTE_NAME) {
                    $rootScope.$broadcast('veganaut.location.startAddLocation');
                }
                else {
                    this._onMapInitialiseStartAddLocation = true;
                    $location.url('/map/');
                }
            };

            /**
             * Handler for changes to the center and zoom of the map.
             * The controller is responsible for calling this method.
             * @param {{}} newCenter
             */
            MainMapService.prototype.onCenterChanged = function(newCenter) {
                // Create an area from the new center
                var newArea = new Area(newCenter);

                // Only proceed if the area is valid
                if (newArea.isValid()) {
                    // The first time the center changes (so when _mapAreaForCurrentArea
                    // is undefined), the map just shows the area as defined by the
                    // areaService. This area is not exactly the same, but close enough.
                    // We therefore don't want to trigger an actual change in area. If
                    // we wouldn't do this, just switching from the overview to the map
                    // and back would change the area..
                    if (angular.isDefined(this._mapAreaForCurrentArea)) {
                        // TODO: improve to also not set area when doing actions such as resizing the window
                        areaService.setArea(newArea);

                        // Map was moved, so we are no longer showing the area initially defined,
                        // unset the custom title (if one was ever set)
                        pageTitleService.addCustomTitle(undefined);
                    }

                    // Store that we are now showing this area
                    this._mapAreaForCurrentArea = newArea;

                    // Update URL and reload locations
                    areaService.writeAreaToUrl();
                    this._reloadLocations();
                }
            };

            return new MainMapService();
        }
    ]);
})(window.veganaut.mapModule);
