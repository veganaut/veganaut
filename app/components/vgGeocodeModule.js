(function() {
    'use strict';

    /**
     * Module that provides geocoding through OSM Nominatim
     *
     * @type {module}
     */
    var module = angular.module('veganaut.geocode', []);

    var BASE_URL = '//nominatim.openstreetmap.org';

    /**
     * Represents a geocoding results
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
    };

    /**
     * Formats a nice display name for this geocode result
     * @returns {string}
     */
    GeocodeResult.prototype.getDisplayName = function() {
        var that = this;
        var parts = [];

        // Check if there is a valid type in the address
        if (angular.isString(this.type) && angular.isString(this.address[this.type])) {
            parts.push(this.address[this.type]);
        }

        // Add other parts
        _.each(['road', 'house_number', 'village', 'city', 'country'], function(partName) {
            if (angular.isString(that.address[partName])) {
                parts.push(that.address[partName]);
            }
        });

        // Join them all by commas
        return parts.join(', ');
    };

    // Define the geocodeService
    module.factory('geocodeService', ['$http', '$q', 'localeService', function($http, $q, localeService) {
        /**
         * Geocode service provides an interface to OSM Nominatim API
         * @constructor
         */
        var GeocodeService = function() {
        };

        /**
         * Geocode the given search string
         * @param {string} searchString
         * @param {number} [limit=3]
         * @returns {promise}
         */
        GeocodeService.prototype.search = function(searchString, limit) {
            var locale = localeService.getLocale();
            var deferred = $q.defer();
            $http.get(BASE_URL + '/search', {
                params: {
                    q: searchString,
                    limit: limit || 3,
                    'accept-language': locale,
                    addressdetails: true,
                    format: 'json'
                }
            })
                .success(function(data) {
                    var results = [];
                    for (var i = 0; i < data.length; i += 1) {
                        results.push(new GeocodeResult(data[i]));
                    }
                    deferred.resolve(results);
                })
                .error(function(data) {
                    deferred.reject(data);
                })
            ;

            return deferred.promise;
        };

        return new GeocodeService();
    }]);
})();
