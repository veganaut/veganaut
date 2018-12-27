(function() {
    'use strict';

    /**
     * Module that provides geocoding through OSM Nominatim
     *
     * @type {module}
     */
    var module = angular.module('veganaut.geocode', []);

    /**
     * Base URL of the OSM Nominatim API
     * @type {string}
     */
    var BASE_URL = '//nominatim.openstreetmap.org';

    /**
     * List of classes that denote items returned from the Nominatim search
     * that represent a building (shops, restaurants, ...) or other content
     * that is not generally a geographical place like a street, city or country.
     *
     * Extracted from http://wiki.openstreetmap.org/wiki/Map_Features
     * @type {string[]}
     */
    var OSM_BUILDING_CLASSES = [
        'leisure',
        'amenity',
        'office',
        'shop',
        'office',
        'craft',
        'tourism',
        'landuse'
    ];

    /**
     * Mapping of OSM long type to short type.
     * See https://wiki.openstreetmap.org/wiki/Nominatim#Reverse_Geocoding
     * @type {{}}
     */
    var OSM_TYPE_MAPPING = {
        node: 'N',
        relation: 'R',
        way: 'W'
    };

    module.factory('GeocodeResult', ['Area', function(Area) {
        /**
         * Represents a geocoding results
         * TODO: Is there any use in having a separate model here and not just using Area?
         * @param {{}} data JSON returned by the geocoding service
         * @constructor
         */
        var GeocodeResult = function(data) {
            this.address = data.address || {};
            this.type = data.type;

            // Parse latitude
            if (angular.isString(data.lat)) {
                this.lat = parseFloat(data.lat);
            }

            // Longitude is given as 'lon'
            if (angular.isString(data.lon)) {
                this.lng = parseFloat(data.lon);
            }

            // Parse the bounding box
            if (angular.isArray(data.boundingbox)) {
                this.bounds = [
                    [parseFloat(data.boundingbox[0]), parseFloat(data.boundingbox[2])],
                    [parseFloat(data.boundingbox[1]), parseFloat(data.boundingbox[3])]
                ];
            }

            // Store id and type to generate the areaId
            this._osmId = data['osm_id'];
            this._osmType = data['osm_type'];
        };

        /**
         * Returns an Area that corresponds to this GeocodeResult
         * @returns {Area}
         */
        GeocodeResult.prototype.getArea = function() {
            return new Area({
                id: this._getAreaId(),
                shortName: this.getShortName(),
                longName: this.getLongName(),
                lat: this.lat,
                lng: this.lng,
                boundingBox: this.bounds
            });
        };

        /**
         * Gets a long name (~complete address if it makes sense) for this
         * geocode result.
         * TODO: merge this with the method in the backend doing roughly the same thing
         * @returns {string}
         */
        GeocodeResult.prototype.getLongName = function() {
            // TODO: add tests for this
            var that = this;
            var parts = this._getRelevantAddressParts();

            // Join them all by commas
            return _.map(parts, function(partName) {
                return that.address[partName];
            }).join(', ');
        };


        /**
         * Gets a short name for this geocode result (only for example the
         * city name or street name)
         * @returns {string}
         */
        GeocodeResult.prototype.getShortName = function() {
            // Get the relevant parts and return the first one
            var parts = this._getRelevantAddressParts();
            if (parts.length > 0) {
                return this.address[parts[0]];
            }
            return undefined;
        };

        /**
         * Returns the parts of the address that should be used for displaying
         * the name of this GeocodeResult.
         * @returns {string[]}
         * @private
         */
        GeocodeResult.prototype._getRelevantAddressParts = function() {
            var that = this;
            var parts = [];

            // Check if there is a valid type in the address
            if (angular.isString(that.type) && angular.isString(that.address[that.type])) {
                parts.push(that.type);
            }

            // TODO NEXT: use something smarter in the direction of convertFromOsmAddress method from the backend?
            // current problem: https://nominatim.openstreetmap.org/search?accept-language=de&addressdetails=true&format=json&limit=3&q=koeln

            // Add other parts
            _.each(['road', 'footway', 'pedestrian', 'house_number', 'hamlet',
                    'village', 'town', 'city_district', 'city', 'country'],
                function(partName) {
                    // Include the given part if wasn't already added as type and if it actually exists
                    if (partName !== that.type && angular.isString(that.address[partName])) {
                        parts.push(partName);
                    }
                }
            );

            // Return the found parts
            return parts;
        };

        /**
         * Gets the unique id of this OSM geocode result. The id will always start
         * with an "o" so that it can be distinguished from areas from other sources
         * than OSM.
         *
         * Note also that the id should never contain the string "---" (this assumption
         * is used when parsing it from the URL). See URL_PLACE_NAME_ID_SEPARATOR.
         *
         * @returns {string}
         * @returns {string}
         * @private
         */
        GeocodeResult.prototype._getAreaId = function() {
            // First part of the unique id is an "o", indicating that this is an
            // id from open street map
            var areaId = 'o';

            // Next part is the osm type
            if (OSM_TYPE_MAPPING.hasOwnProperty(this._osmType)) {
                areaId += OSM_TYPE_MAPPING[this._osmType];
            }
            else {
                // Shouldn't really happen, but who knows when OSM changes
                areaId += this._osmType;
            }

            // Last part is the integer id from OSM
            areaId += this._osmId;

            return areaId;
        };

        return GeocodeResult;
    }]);

    // Define the geocodeService
    module.factory('geocodeService', ['$http', '$q', 'localeService', 'GeocodeResult', function($http, $q, localeService, GeocodeResult) {
        /**
         * Geocode service provides an interface to OSM Nominatim API
         * @constructor
         */
        var GeocodeService = function() {
        };

        /**
         * Geocode the given search string
         * @param {string} searchString
         * @param {number} [limit=5]
         * @param {boolean} [filterBuildings=true] Whether to filter out buildings to only return
         *      countries, cities, streets, etc.
         * @returns {promise}
         */
        GeocodeService.prototype.search = function(searchString, limit, filterBuildings) {
            var locale = localeService.getLocale();
            var deferred = $q.defer();
            $http.get(BASE_URL + '/search',
                {
                    params: {
                        q: searchString,
                        limit: limit || 5,
                        'accept-language': locale,
                        addressdetails: true,
                        format: 'json'
                    }
                })
                .then(function(data) {
                    var results = [];
                    for (var i = 0; i < data.length; i += 1) {
                        // Check if we should filter. If yes, don't add buildings to the results.
                        if (filterBuildings === false ||
                            OSM_BUILDING_CLASSES.indexOf(data[i].class) === -1)
                        {
                            results.push(new GeocodeResult(data[i]));
                        }
                    }
                    deferred.resolve(results);
                },
                function(data) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        };

        /**
         * Performs a reverse lookup of the given coordinates at the given zoom level
         * @param {number} lat
         * @param {number} lng
         * @param {number} zoom Between 0 and 18
         * @returns {promise}
         */
        GeocodeService.prototype.reverseSearch = function(lat, lng, zoom) {
            var locale = localeService.getLocale();
            var deferred = $q.defer();
            $http.get(BASE_URL + '/reverse',
                {
                    params: {
                        lat: lat,
                        lon: lng,
                        zoom: zoom,
                        'accept-language': locale,
                        addressdetails: true,
                        format: 'json'
                    }
                })
                .then(function(data) {
                    // API doesn't use correct HTTP return codes for errors
                    if (angular.isObject(data) && angular.isString(data.error)) {
                        deferred.reject(data);
                    }
                    else {
                        var result = new GeocodeResult(data);
                        deferred.resolve(result);
                    }
                }, function(data) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        };

        /**
         * Gets a geocode result by the areaId.
         * @param {string} areaId
         * @returns {Promise<GeocodeResult>}
         */
        GeocodeService.prototype.getByAreaId = function(areaId) {
            var deferred = $q.defer();

            var osmAreaIdParts = areaId.match(/^o([a-zA-Z]+)([0-9]+)$/);
            if (osmAreaIdParts) {
                var osmType = osmAreaIdParts[1];
                var osmId = osmAreaIdParts[2];

                $http.get(BASE_URL + '/reverse',
                    {
                        params: {
                            'osm_id': osmId,
                            'osm_type': osmType,
                            'accept-language': localeService.getLocale(),
                            addressdetails: true,
                            format: 'json'
                        }
                    })
                    .then(function(data) {
                        // TODO: De-duplicate this with the reverseSearch method
                        // API doesn't use correct HTTP return codes for errors
                        if (angular.isObject(data) && angular.isString(data.error)) {
                            deferred.reject(data);
                        }
                        else {
                            var result = new GeocodeResult(data);
                            deferred.resolve(result);
                        }
                    }, function(data) {
                        deferred.reject(data);
                    })
                ;
            }
            else {
                deferred.reject('Invalid OSM area id');
            }

            return deferred.promise;
        };

        return new GeocodeService();
    }]);
})();
