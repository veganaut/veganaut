(function() {
    'use strict';

    var module = angular.module('veganaut.app.backend', []);

    /**
     * Interface with the backend
     * TODO: rather return promises for the return object instead of $http promises
     * TODO: refactor to be a proper class
     */
    module.provider('backendService', function() {
        var $http;
        var $rootScope;
        var backendUrl;
        var sessionService;

        /**
         * Person id is set if the user entered a reference code but is not
         * logged in
         */
        var personId;

        /**
         * Returns whether the user is currently logged in
         * @returns {boolean}
         */
        var isLoggedIn = function() {
            return sessionService.hasValidSession();
        };

        /**
         * Returns whether there is a valid person id set
         * @returns {boolean}
         */
        var hasValidPersonId = function() {
            return (angular.isString(personId));
        };

        /**
         * Returns whether the user is allowed to view the graph
         * @returns {boolean}
         */
        var canViewGraph = function() {
            return isLoggedIn() || hasValidPersonId();
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
        var register = function(email, fullName, nickname, password) {
            var postData = {
                email: email,
                fullName: fullName,
                nickname: nickname,
                password: password
            };

            // If we already have a person id, register as that person
            if (personId) {
                postData.id = personId;
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
        var login = function(email, password) {
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
        var logout = function() {
            // TODO: make sure we are logged in first
            return $http.delete(backendUrl + '/session')
                .finally(sessionService.destroySession.bind(sessionService));
        };

        /**
         * Sends the get activity list request to the backend
         * @returns {promise} promise returned from $http.get
         * TODO: cache this list for a while
         */
        var getActivities = function() {
            // TODO: make sure we are logged in first
            return $http.get(backendUrl + '/activity');
        };

        /**
         * Sends the get graph request to the backend
         * @returns {promise} promise returned from $http.get
         */
        var getGraph = function() {
            var person;
            if (isLoggedIn()) {
                person = 'me';
            }
            else if (hasValidPersonId()) {
                person = personId;
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
        var addActivityLink = function(person, activity) {
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
        var submitReferenceCode = function(referenceCode) {
            var postData = {
                referenceCode: referenceCode
            };

            return $http.post(backendUrl + '/activityLink/reference', postData)
                .success(function(data) {
                    // TODO: validate id?
                    personId = data.target;
                });
        };

        /**
         * Gets the list of open activityLink for the logged in user
         *
         * @returns {promise}
         */
        var getOpenActivityLinks = function() {
            // TODO: make sure we are logged in first
            return $http.get(backendUrl + '/activityLink/mine/open');
        };

        /**
         * Gets the match data
         *
         * @returns {promise}
         */
        var getMatch = function() {
            return $http.get(backendUrl + '/match');
        };

        /**
         * Gets the score data
         * @returns {promise}
         */
        var getScore = function() {
            return $http.get(backendUrl + '/score');
        };

        /**
         * Gets the currently logged in user info
         * @returns {HttpPromise}
         */
        var getMe = function() {
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
        var updateMe = function(email, fullName, nickname, password) {
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
        var getLocations = function() {
            return $http.get(backendUrl + '/location/list');
        };

        /**
         * Gets the location with the given id
         * @params {string} id
         * @returns {HttpPromise}
         */
        var getLocation = function(id) {
            return $http.get(backendUrl + '/location/' + id);
        };

        /**
         * Requests the lat/lng based on the ip of the user
         * @returns {HttpPromise}
         */
        var getGeoIP = function() {
            return $http.get(backendUrl + '/geoip');
        };

        /**
         * Submits the given Mission to the backend
         * @param {{}} missionData
         * @param {Location} location
         * @returns {HttpPromise}
         */
        var submitMission = function(missionData, location) {
            missionData.location = location.id;
            return $http.post(backendUrl + '/mission', missionData);
        };

        /**
         * Submits the given Location
         * @param {Location} location
         * @returns {HttpPromise}
         */
        var submitLocation = function(locationData) {
            return $http.post(backendUrl + '/location', locationData);
        };


        /**
         * Returns this service
         * @type {*[]}
         */
        this.$get = ['$http', '$rootScope', 'backendUrl', 'sessionService',
            function(_$http_, _$rootScope_, _backendUrl_, _sessionService_) {
                $http = _$http_;
                $rootScope = _$rootScope_;
                backendUrl = _backendUrl_;
                sessionService = _sessionService_;

                // Subscribe to session events
                $rootScope.$onRootScope('veganaut.session.created', function() {
                    personId = undefined;
                });
                $rootScope.$onRootScope('veganaut.session.destroyed', function() {
                    personId = undefined;
                });

                return {
                    isLoggedIn: isLoggedIn,
                    canViewGraph: canViewGraph,
                    register: register,
                    login: login,
                    logout: logout,
                    getActivities: getActivities,
                    getGraph: getGraph,
                    addActivityLink: addActivityLink,
                    submitReferenceCode: submitReferenceCode,
                    getOpenActivityLinks: getOpenActivityLinks,
                    getMatch: getMatch,
                    getScore: getScore,
                    getMe: getMe,
                    updateMe: updateMe,
                    getLocations: getLocations,
                    getLocation: getLocation,
                    getGeoIP: getGeoIP,
                    submitMission: submitMission,
                    submitLocation: submitLocation
                };
            }
        ];
    });
})();
