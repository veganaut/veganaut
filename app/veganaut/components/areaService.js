angular.module('veganaut.app.main').factory('areaService', [
    '$q', '$window', '$location', '$route', '$rootScope',
    'slug', 'constants', 'Area', 'backendService', 'localeService', 'geocodeService',
    function($q, $window, $location, $route, $rootScope,
        slug, constants, Area, backendService, localeService, geocodeService)
    {
        'use strict';

        /**
         * Local storage id used for storing the current area info
         * @type {string}
         */
        var AREA_STORAGE_ID = 'veganautArea';

        /**
         * Infos about pages where areas can be shown.
         * Maps the route name to the path of the route.
         * TODO: one should be able to get this from the router directly.
         * @type {{}}
         */
        var AREA_PAGE_INFOS = {
            areaOverview: '/area/',
            map: '/map/',
            list: '/list/'
        };

        /**
         * Service that keeps track of the Area that the user is currently
         * viewing, be it on the map, the list or anywhere else.
         * @constructor
         */
        var AreaService = function() {
            /**
             * Area that the user is currently looking at. The area is independent
             * of the format (list, map, ...) that it is shown as.
             * @type {Area}
             * @private
             */
            this._currentArea = new Area({
                lat: 0,
                lng: 0,
                zoom: 2,
                radius: constants.WHOLE_WORLD_RADIUS
            });

            /**
             * The last area that was set that has an id.
             *
             * @see Area.hasId() for detailed explanation of Areas with ids
             * @type {Area}
             * @private
             */
            this._lastAreaWithId = undefined;

            /**
             * Deferred that will be resolved when the area service is initialised.
             * Meaning that we tried all possible ways of getting an initial Area.
             * @type {Deferred}
             * @private
             */
            this._initialisedDeferred = $q.defer();

            // Try to load area from local storage
            var initialised = this.setArea(new Area(
                JSON.parse($window.localStorage.getItem(AREA_STORAGE_ID) || '{}')
            ));

            if (initialised) {
                // We are done initialising
                this._initialisedDeferred.resolve();
            }
            else {
                // If not initialised from local storage, try from URL
                var that = this;
                that.setAreaFromUrl()
                    .catch(function() {
                        // If from URL didn't work either, try backend (from IP)
                        return backendService.getGeoIP(localeService.getLocale())
                            .then(function(res) {
                                var data = res.data;
                                if (_.isObject(data) && Object.keys(data).length > 0) {
                                    that.setArea(new Area({
                                        id: data.areaId,
                                        shortName: data.countryName,
                                        longName: data.countryName,
                                        lat: data.lat,
                                        lng: data.lng,
                                        boundingBox: data.boundingBox
                                    }));
                                }
                            })
                        ;
                    })
                    .finally(function() {
                        // In any case we are done initialising (either with the backend area or the default set first)
                        that._initialisedDeferred.resolve();
                    })
                ;

            }
        };

        /**
         * Returns a promise that resolves when the service is initialised
         * and getCurrentArea() can be used.
         * @returns {Promise}
         */
        AreaService.prototype.initialised = function() {
            return this._initialisedDeferred.promise;
        };

        /**
         * Returns the currently set Area
         * @returns {Area}
         */
        AreaService.prototype.getCurrentArea = function() {
            return this._currentArea;
        };

        /**
         * Returns last area that was set that had an id.
         * Will return undefined if not area was ever set with an id.
         * @returns {Area}
         */
        AreaService.prototype.getLastAreaWithId = function() {
            return this._lastAreaWithId;
        };

        /**
         * Sets the given area as the current one.
         * @param {Area} area
         * @returns {boolean} Whether the area was set (meaning it was valid)
         */
        AreaService.prototype.setArea = function(area) {
            if (area instanceof Area && area.isValid()) {
                this._currentArea = area;

                // Store it in local storage
                $window.localStorage.setItem(AREA_STORAGE_ID, JSON.stringify(this._currentArea));

                if (area.hasId()) {
                    this._lastAreaWithId = area;
                }

                return true;
            }

            return false;
        };

        /**
         * Makes sure the given area has a long and short name set.
         *
         * The difference to just accessing the name property of the Area is that this
         * will performs a reverse lookup to get an approximate name if the Area has
         * no name yet. The retrieved name is written to the passed area instance.
         *
         * @param {Area} area
         * @returns {Promise}
         */
        AreaService.prototype.retrieveNameForArea = function(area) {
            // If the area already has a name, return immediately
            if (angular.isDefined(area.shortName)) {
                return $q.when();
            }
            else {
                // We use the center from the radius params as that will set the most
                // appropriate center (from explicitly set, boundingbox, whole world, ...)
                var radiusParams = area.getRadiusParams();

                // Simple fallback display name in case the reverse lookup doesn't work out.
                // TODO: should be translated and displayed nicer
                var fallbackDisplayName = 'lat ' + radiusParams.lat.toFixed(3) + ' lng ' + radiusParams.lng.toFixed(3);

                // Reverse lookup a place name for these coordinates
                // Choose a zoom level based on the radius
                var reverseLookupZoom = (radiusParams.radius < 2000) ? 16 : 13;
                return geocodeService.reverseSearch(radiusParams.lat, radiusParams.lng, reverseLookupZoom)
                    .then(function(place) {
                        if (place) {
                            // Set the area name to not retrieve it again
                            area.shortName = place.getShortName();
                            area.longName = place.getLongName();

                        }
                        else {
                            // Could not find a name, resolve with fallback
                            // TODO: Should this result not be stored? There might just be nothing to geocode, or there's a problem with the API
                            area.shortName = fallbackDisplayName;
                            area.longName = fallbackDisplayName;
                        }
                    })
                    .catch(function() {
                        // Could not find a name, resolve with fallback
                        area.shortName = fallbackDisplayName;
                        area.longName = fallbackDisplayName;
                    })
                ;
            }
        };

        /**
         * Sets the given area as the current one and shows that area on the given
         * target page.
         *
         * @param {Area} area
         * @param {string} page: either 'map', 'list' or 'areaOverview'
         */
        AreaService.prototype.setAreaAndShowOn = function(area, page) {
            // Store the id of the previous area, to be able to check if it changed
            var lastAreaId = this._currentArea ? this._currentArea.id : undefined;

            // Set the area, continue regardless of whether it was successfully set
            this.setArea(area);

            // Check if the area changed
            // TODO: improve this to also work on other grounds than same id (e.g. same bbox)
            var areaChanged = area.hasId() && area.id !== lastAreaId;

            // Get the infos for the target page
            var path = AREA_PAGE_INFOS[page];

            // Check if infos are there and set the area
            if (angular.isString(path)) {
                // The area was set, check if we are already on the correct page
                if ($route.current.vgRouteName === page) {
                    if (areaChanged) {
                        // Emit an event to let the page know it should update if the area changed
                        $rootScope.$broadcast('veganaut.area.changed');
                    }
                }
                else {
                    // Go to the target page
                    $location.url(path);
                }

                // All went well
                return true;
            }
            else {
                // Return false if we could not set the area or target page was unknown
                return false;
            }
        };

        /**
         * Parses the correct Area from the current URL
         * TODO: refactor into smaller methods
         * @returns {boolean} Whether the URL contained a valid Area
         */
        AreaService.prototype.setAreaFromUrl = function() {
            var that = this;

            // We use the $location instead of $routeParams as the latter might not have been
            // initialised when this is called from the constructor.
            var urlParams = $location.search();

            // Promise to keep track of the progress of parsing the URL
            var promise;

            // Try first to resolve from the area id given in the parameter "a"
            var placeParts = (urlParams.a || '').split(constants.URL_PLACE_NAME_ID_SEPARATOR);
            if (placeParts.length === 2 && placeParts[1].length > 0) {
                var areaId = placeParts[1];

                // Check if the given area is already set in some way
                if (that._currentArea instanceof Area && areaId === that._currentArea.id) {
                    // Already have the right area as current, not doing anything
                    promise = $q.when();
                }
                else if (that._lastAreaWithId instanceof Area && areaId === that._lastAreaWithId.id) {
                    // The last area with id is requested, reset to that one
                    that.setArea(that._lastAreaWithId);
                    promise = $q.when();
                }
                else {
                    // Resolve the area by id from the geocode service
                    promise = geocodeService.getByAreaId(areaId)
                        .then(function(geoResult) {
                            that.setArea(geoResult.getArea());
                        })
                    ;
                }
            }
            else {
                // No area id given, we can't set based on the id
                promise = $q.reject();
            }

            // Try the next way of getting area from the URL if the area id didn't work out
            return promise.catch(function() {
                var areaSet = false;

                // Try to parse coords from url
                var rawCoords = urlParams.coords || '';
                var lat, lng;

                // Parse the coordinates
                var splitCoords = rawCoords.split(',');
                if (splitCoords.length === 2) {
                    lat = parseFloat(splitCoords[0]);
                    lng = parseFloat(splitCoords[1]);

                    // Try to set based on radius (will check if it's valid)
                    areaSet = that.setArea(new Area({
                        lat: lat,
                        lng: lng,
                        radius: parseInt(urlParams.radius, 10)
                    }));

                    if (!areaSet) {
                        // Try it with zoom
                        areaSet = that.setArea(new Area({
                            lat: lat,
                            lng: lng,
                            zoom: parseInt(urlParams.zoom, 10)
                        }));
                    }
                }

                if (!areaSet) {
                    return $q.reject('Could not parse area from URL');
                }
            });
        };

        /**
         * Writes the currently set area to the URL if we are on one
         * of the pages that shows areas.
         */
        AreaService.prototype.writeAreaToUrl = function() {
            var currentPage = $route.current.vgRouteName;

            if (!AREA_PAGE_INFOS.hasOwnProperty(currentPage)) {
                // We don't do anything if we are not on a page that shows areas
                return;
            }

            var lat, lng, zoomParam, radiusParam, areaParam;

            if (this._currentArea.hasId()) {
                // If the current area has an id, use that in the URL
                areaParam = slug((this._currentArea.longName || ''), {lower: true}) +
                    constants.URL_PLACE_NAME_ID_SEPARATOR + this._currentArea.id;
            }
            else {
                // TODO: use constants for route names
                switch ($route.current.vgRouteName) {
                case 'map':
                    lat = this._currentArea.getLat();
                    lng = this._currentArea.getLng();
                    zoomParam = this._currentArea.getZoom();
                    break;
                case 'list': // List and areaOverview have the same URL params
                case 'areaOverview':
                    var params = this._currentArea.getRadiusParams();
                    lat = params.lat;
                    lng = params.lng;
                    radiusParam = params.radius;
                    break;
                }
            }

            var coordsParam;
            if (angular.isDefined(lat) && angular.isDefined(lng)) {
                coordsParam =
                    lat.toFixed(constants.URL_FLOAT_PRECISION) + ',' +
                    lng.toFixed(constants.URL_FLOAT_PRECISION)
                ;
            }

            // Replace the url params (without adding a new history item)
            // Can't use $route.updateParams as this will set all params, not only the ones we want
            $location.replace();
            $location.search('zoom', zoomParam);
            $location.search('coords', coordsParam);
            $location.search('radius', radiusParam);
            $location.search('a', areaParam);
        };

        return new AreaService();
    }
]);
