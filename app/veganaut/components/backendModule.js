(function() {
    'use strict';

    var module = angular.module('veganaut.app.backend', []);

    /**
     * Interface with the backend
     * TODO: rather return promises for the return object instead of $http promises
     * TODO: split this up in different semantically grouped services
     */
    module.factory('backendService', [
        '$q', '$http', 'backendUrl', 'sessionService', 'i18nSettings',
        function($q, $http, backendUrl, sessionService, i18nSettings) {
            var BackendService = function() {
            };

            /**
             * Returns whether the user is currently logged in
             * @returns {boolean}
             */
            BackendService.prototype.isLoggedIn = function() {
                return sessionService.hasValidSession();
            };

            /**
             * Registers a new user.
             * @param {string} email
             * @param {string} nickname
             * @param {string} locale Only submitted if valid
             * @returns {promise}
             */
            BackendService.prototype.register = function(email, nickname, locale) {
                var postData = {
                    email: email,
                    nickname: nickname
                };

                // Only submit locale if it's valid
                if (i18nSettings.availableLocales.indexOf(locale) >= 0) {
                    postData.locale = locale;
                }

                return $http.post(backendUrl + '/person', postData)
                    .success(function(data) {
                        sessionService.createSession(data.sessionId);
                    });
            };

            /**
             * Sends the login request to the backend
             *
             * @param email
             * @param password
             * @returns {promise} promise returned from $http.post
             */
            BackendService.prototype.login = function(email, password) {
                return $http.post(backendUrl + '/session', {email: email, password: password})
                    .success(function(data) {
                        sessionService.createSession(data.sessionId);
                    });
            };

            /**
             * Sends the logout request to the backend
             * @returns {promise}
             */
            BackendService.prototype.logout = function() {
                // TODO: make sure we are logged in first
                return $http.delete(backendUrl + '/session')
                    .finally(sessionService.destroySession.bind(sessionService));
            };

            /**
             * Gets the score data
             * @returns {promise}
             */
            BackendService.prototype.getScore = function() {
                return $http.get(backendUrl + '/score');
            };

            /**
             * Gets the currently logged in user info
             * @returns {HttpPromise}
             */
            BackendService.prototype.getMe = function() {
                // TOTO: make sure we are logged in first
                return $http.get(backendUrl + '/person/me');
            };

            /**
             * Posts the new player data. Only the fields that are
             * given are updated. Possible fields are:
             * email, fullName, nickname, password, locale
             * @param {{}} newData
             * @returns {HttpPromise}
             */
            BackendService.prototype.updateMe = function(newPlayerData) {
                newPlayerData = _.pick(newPlayerData, 'email', 'fullName', 'nickname', 'password', 'locale');
                if (newPlayerData.password === '') {
                    // Don't submit empty new password
                    delete newPlayerData.password;
                }
                return $http.put(backendUrl + '/person/me', newPlayerData);
            };

            /**
             * Gets the list of products within the given area, ordered by rating.
             * @param {number} lat
             * @param {number} lng
             * @param {number} radius
             * @param {string} [locationType] whether to only get products of a specific location type
             * @param {number} [skip] number of products to skip from the beginning of the list
             * @param {number} [limit] number of products to return
             * @returns {HttpPromise}
             */
            BackendService.prototype.getProducts = function(lat, lng, radius, locationType, skip, limit) {
                return $http.get(backendUrl + '/product/list', {
                    params: {
                        lat: lat,
                        lng: lng,
                        radius: radius,
                        locationType: locationType,
                        limit: limit,
                        skip: skip
                    }
                });
            };

            /**
             * Gets the list of locations on the map with the given params.
             * Query can either by by bounds or by lat/lng/radius.
             * @param {{}} params Params to pass on to the backend
             * @returns {HttpPromise}
             */
            BackendService.prototype.getLocations = function(params) {
                // TODO: the canceller should be added centrally for every request
                var canceller = $q.defer();
                var promise = $http.get(backendUrl + '/location/list', {
                    params: params,
                    timeout: canceller.promise
                });

                // Add a method to cancel request
                promise.cancelRequest = function() {
                    canceller.resolve();
                };

                return promise;
            };

            /**
             * Gets the location with the given id
             * @params {string} id
             * @returns {HttpPromise}
             */
            BackendService.prototype.getLocation = function(id) {
                return $http.get(backendUrl + '/location/' + id);
            };

            /**
             * Searches locations by the given string
             * @param {string} searchString
             * @param {number} limit
             * @returns {HttpPromise}
             */
            BackendService.prototype.getLocationSearch = function(searchString, limit) {
                return $http.get(backendUrl + '/location/search', {
                    params: {
                        query: searchString,
                        limit: limit
                    }
                });
            };

            /**
             * Requests the lat/lng based on the ip of the user
             * @param {string} [language] Optional language (for the country name)
             * @returns {HttpPromise}
             */
            BackendService.prototype.getGeoIP = function(language) {
                return $http.get(backendUrl + '/geoip', {
                    params: {
                        lang: language
                    }
                });
            };

            /**
             * Submits the given Location
             * @param {Location} location
             * @returns {HttpPromise}
             */
            BackendService.prototype.submitLocation = function(locationData) {
                return $http.post(backendUrl + '/location', locationData);
            };

            /**
             * Updates the given location
             * @param {string} locationId
             * @param {{}} locationData
             * @returns {HttpPromise}
             */
            BackendService.prototype.updateLocation = function(locationId, locationData) {
                return $http.put(backendUrl + '/location/' + locationId, locationData);
            };

            /**
             * Send a password reset email
             * @param {string} email
             * @param {boolean} [isRegistration=false] Whether this is the "reset" during
             *      registration when the user gives no password.
             * @returns {HttpPromise}
             *
             */
            BackendService.prototype.sendPasswordResetMail = function(email, isRegistration) {
                var type = (isRegistration === true) ? 'registration' : 'reset';
                return $http.post(backendUrl + '/passwordResetEmail', {
                    email: email,
                    type: type
                });
            };

            /**
             * Checks whether the given password reset token is valid
             * @param {string} token
             * @returns {HttpPromise}
             */
            BackendService.prototype.isValidToken = function(token) {
                return $http.get(backendUrl + '/person/isValidToken/' + token);
            };

            /**
             * Tries to reset the password with the given token.
             * @param {string} token
             * @param {string} password
             * @returns {HttpPromise}
             */
            BackendService.prototype.resetPassword = function(token, password) {
                var postData = {
                    token: token,
                    password: password
                };

                return $http.post(backendUrl + '/person/reset', postData);
            };

            /**
             * Gets the person information with the given id
             * @params {string} id
             * @returns {HttpPromise}
             */
            BackendService.prototype.getPerson = function(id) {
                return $http.get(backendUrl + '/person/' + id);
            };

            /**
             * Gets the list of available missions at a location
             * TODO WIP: get rid of this method
             * @param locationId
             * @returns {HttpPromise}
             */
            BackendService.prototype.getAvailableMissions = function(locationId) {
                return $http.get(backendUrl + '/location/' + locationId + '/availableMission/list');
            };

            /**
             * Gets the area overview info: how many locations and products of which type
             * @param lat
             * @param lng
             * @param radius
             * @returns {Promise}
             */
            BackendService.prototype.getAreaOverview = function(lat, lng, radius) {
                return $http.get(backendUrl + '/areaOverview', {
                    params: {
                        lat: lat,
                        lng: lng,
                        radius: radius
                    }
                }).then(function(res) {
                    return res.data;
                });
            };

            /**
             * Gets a randomly selected Veganize task of the given task type.
             * @param {string} taskType
             * @param {string} locationType
             * @param {string} locationId
             * @returns {Promise}
             */
            BackendService.prototype.getRelatedVeganizeTask = function(taskType, locationType, locationId) {
                return $http
                    .get(backendUrl + '/task/relatedVeganize', {
                        params: {
                            type: taskType,
                            locationType: locationType,
                            locationId: locationId
                        }
                    })
                    .then(function(res) {
                        return res.data;
                    })
                    .catch(function(res) {
                        return $q.reject(res.data);
                    });
            };

            /**
             * Submit a task of a certain type with the given outcome and for
             * the given location and optionally product
             * @param {string} taskType
             * @param {{}} outcome
             * @param {Location} location
             * @param {{}} [product=undefined]
             * @returns {Promise}
             */
            BackendService.prototype.submitTask = function(taskType, outcome, location, product) {
                return $http
                    .post(backendUrl + '/task', {
                        location: location.id,
                        product: (angular.isObject(product) ? product.id : undefined),
                        type: taskType,
                        outcome: outcome
                    })
                    .then(function(res) {
                        return res.data;
                    })
                    .catch(function(res) {
                        return $q.reject(res.data);
                    });
            };

            // Instantiate and return the service
            return new BackendService();
        }]
    );
})();
