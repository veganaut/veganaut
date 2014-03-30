(function(servicesModule) {
    'use strict';

    /**
     * Interface with the backend
     */
    servicesModule.provider('backend', function() {
        var $http;
        var backendUrl;
        var alertProvider;

        /**
         * The session id of the current user
         */
        var sessionId;

        /**
         * Person id is set if the user entered a reference code but is not
         * logged in
         */
        var personId;

        /**
         * Handles a login with the given session id
         * @param sid
         */
        var handleLogin = function(sid) {
            if (angular.isString(sid)) {
                sessionId = sid;
                personId = undefined;
                sessionStorage.setItem('sid', sid);
                $http.defaults.headers.common.Authorization = 'MonkeyBearer ' + sid;
            }
        };

        /**
         * Logs the user out (removes the session)
         */
        var handleLogout = function() {
            sessionId = undefined;
            personId = undefined;
            sessionStorage.removeItem('sid');
            $http.defaults.headers.common.Authorization = undefined;

            alertProvider.removeAllAlerts();
        };

        /**
         * Returns whether the user is currently logged in
         * @returns {boolean}
         */
        var isLoggedIn = function() {
            return (angular.isString(sessionId));
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
         * @param password
         * @returns {promise}
         */
        var register = function(email, fullName, password) {
            var postData = {
                email: email,
                fullName: fullName,
                password: password
            };

            // If we already have a person id, register as that person
            if (personId) {
                postData._id = personId;
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
                    handleLogin(data.sessionId);
                })
                .error(handleLogout);
        };

        /**
         * Sends the logout request to the backend
         * @returns {promise} promise returned from $http.delete
         */
        var logout = function() {
            // TODO: make sure we are logged in first
            return $http.delete(backendUrl + '/session')
                .success(handleLogout)
                .error(handleLogout);
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
         * Returns this service
         * @type {*[]}
         */
        this.$get = ['$http', 'backendUrl', 'alertProvider', function(_$http_, _backendUrl_, _alertProvider_) {
            $http = _$http_;
            backendUrl = _backendUrl_;
            alertProvider = _alertProvider_;

            // Try to get session sid from storage
            handleLogin(sessionStorage.getItem('sid'));

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
                getMatch: getMatch
            };
        }];
    });
})(window.monkeyFace.servicesModule);
