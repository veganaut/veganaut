(function() {
    'use strict';

    var module = angular.module('veganaut.app.backend', []);

    /**
     * Interface with the backend
     * TODO: rather return promises for the return object instead of $http promises
     */
    module.factory('backendService', ['$http', '$rootScope', 'backendUrl', 'sessionService',
        function($http, $rootScope, backendUrl, sessionService) {
            var BackendService = function() {
                /**
                 * Person id is set if the user entered a reference code but is not
                 * logged in
                 */
                this.personId = undefined;


                // Subscribe to session events
                $rootScope.$onRootScope('veganaut.session.created', function() {
                    this.personId = undefined;
                }.bind(this));
                $rootScope.$onRootScope('veganaut.session.destroyed', function() {
                    this.personId = undefined;
                }.bind(this));
            };

            /**
             * Returns whether the user is currently logged in
             * @returns {boolean}
             */
            BackendService.prototype.isLoggedIn = function() {
                return sessionService.hasValidSession();
            };

            /**
             * Returns whether there is a valid person id set
             * @returns {boolean}
             */
            BackendService.prototype.hasValidPersonId = function() {
                return (angular.isString(this.personId));
            };

            /**
             * Returns whether the user is allowed to view the graph
             * @returns {boolean}
             */
            BackendService.prototype.canViewGraph = function() {
                return this.isLoggedIn() || this.hasValidPersonId();
            };

            /**
             * Registers a new user. If the user has already entered a reference
             * code, the person from that activity's target will be used.
             * @param email
             * @param fullName
             * @param nickname
             * @param password
             * @returns {promise}
             */
            BackendService.prototype.register = function(email, fullName, nickname, password) {
                var postData = {
                    email: email,
                    fullName: fullName,
                    nickname: nickname,
                    password: password
                };

                // If we already have a person id, register as that person
                if (this.personId) {
                    postData.id = this.personId;
                }

                return $http.post(backendUrl + '/person', postData);
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
                    })
                    .error(sessionService.destroySession.bind(sessionService));
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
             * Sends the get activity list request to the backend
             * @returns {promise} promise returned from $http.get
             * TODO: cache this list for a while
             */
            BackendService.prototype.getActivities = function() {
                // TODO: make sure we are logged in first
                return $http.get(backendUrl + '/activity');
            };

            /**
             * Sends the get graph request to the backend
             * @returns {promise} promise returned from $http.get
             */
            BackendService.prototype.getGraph = function() {
                var person;
                if (this.isLoggedIn()) {
                    person = 'me';
                }
                else if (this.hasValidPersonId()) {
                    person = this.personId;
                }
//            else {
//                // TODO: return failed promise
//            }

                return $http.get(backendUrl + '/graph/' + person);
            };

            /**
             * Posts a new activity link with the given data to the backend
             * @param person Either a name of a person to create or a person object
             * @param activity
             * @returns {promise} promise returned from $http.post
             */
            BackendService.prototype.addActivityLink = function(person, activity) {
                // TODO: make sure we are logged in first
                var target = {};
                if (angular.isString(person)) {
                    // Create a person object
                    target.fullName = person;
                }
                else {
                    target.id = person.id;
                }

                // Prepare the data to post
                var postData = {
                    target: target
                };

                // Add activity if given
                if (activity) {
                    postData.activity = {
                        id: activity.id
                    };
                }
                return $http.post(backendUrl + '/activityLink', postData);
            };

            /**
             * Submits the given referenceCode to the backend. Will set the
             * returned target of the activity link as the active person,
             * which makes it possible to query the graph of that person.
             *
             * @param referenceCode
             * @returns {promise} promise returned from $http.post
             */
            BackendService.prototype.submitReferenceCode = function(referenceCode) {
                var postData = {
                    referenceCode: referenceCode
                };

                return $http.post(backendUrl + '/activityLink/reference', postData)
                    .success(function(data) {
                        // TODO: validate id?
                        this.personId = data.target;
                    }.bind(this));
            };

            /**
             * Gets the list of open activityLink for the logged in user
             *
             * @returns {promise}
             */
            BackendService.prototype.getOpenActivityLinks = function() {
                // TODO: make sure we are logged in first
                return $http.get(backendUrl + '/activityLink/mine/open');
            };

            /**
             * Gets the match data
             *
             * @returns {promise}
             */
            BackendService.prototype.getMatch = function() {
                return $http.get(backendUrl + '/match');
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
             * Posts the new player data. If password is not given or empty, it is not updated.
             * @param {string} email
             * @param {string} fullName
             * @param {string} nickname
             * @param {string} [password]
             * @returns {HttpPromise}
             */
            BackendService.prototype.updateMe = function(email, fullName, nickname, password) {
                var data = {
                    email: email,
                    fullName: fullName,
                    nickname: nickname
                };

                if (typeof password !== 'undefined' && password.length > 0) {
                    data.password = password;
                }

                return $http.put(backendUrl + '/person/me', data);
            };

            /**
             * Gets the list of locations on the map
             * @returns {HttpPromise}
             */
            BackendService.prototype.getLocations = function() {
                return $http.get(backendUrl + '/location/list');
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
             * Requests the lat/lng based on the ip of the user
             * @returns {HttpPromise}
             */
            BackendService.prototype.getGeoIP = function() {
                return $http.get(backendUrl + '/geoip');
            };

            /**
             * Submits the given Mission to the backend
             * @param {{}} missionData
             * @param {Location} location
             * @returns {HttpPromise}
             */
            BackendService.prototype.submitMission = function(missionData, location) {
                missionData.location = location.id;
                return $http.post(backendUrl + '/mission', missionData);
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
             * @returns {HttpPromise}
             *
             */
            BackendService.prototype.sendPasswordResetMail = function(email) {
                return $http.post(backendUrl + '/passwordResetEmail',  {email: email});
            };

            /**
             * Checks whether the given password reset token is valid
             * @param {string} token
             * @returns {HttpPromise}
             */
            BackendService.prototype.isValidToken = function(token) {
                 return $http.get(backendUrl + '/person/isValidToken/'+token);
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

            // Instantiate and return the service
            return new BackendService();
        }]
    );
})();
