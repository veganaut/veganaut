(function() {
    'use strict';

    /**
     * Service that handles sessions
     * @param $q
     * @param $rootScope
     * @param backendUrl
     * @constructor
     */
    var SessionService = function($q, $rootScope, backendUrl) {
        this._$q = $q;
        this._$rootScope = $rootScope;

        /**
         * Base URL of the backend API
         * @type {string}
         * @private
         */
        this._backendUrl = backendUrl;

        /**
         * The session id of the current user
         */
        this._sid = localStorage.getItem('sid');
        // TODO: should we read this every time we need it? Can we watch it somehow?
    };

    /**
     * Whether there currently is a valid session
     * @returns {boolean}
     */
    SessionService.prototype.hasValidSession = function() {
        return angular.isString(this._sid);
    };

    /**
     * Creates a new session with the given session id
     * @param {string} sessionId
     */
    SessionService.prototype.createSession = function(sessionId) {
        this._sid = sessionId;
        localStorage.setItem('sid', this._sid);
        this._$rootScope.$broadcast('veganaut.session.created');
    };

    /**
     * Destroys the currently active session
     */
    SessionService.prototype.destroySession = function() {
        if (this.hasValidSession()) {
            this._sid = undefined;
            localStorage.removeItem('sid');
            this._$rootScope.$broadcast('veganaut.session.destroyed');
        }
    };

    /**
     * Whether the given $http config object represent a request
     * to the backend API
     * @param config
     * @returns {boolean}
     * @private
     */
    SessionService.prototype._isBackendRequest = function(config) {
        return (config.url.indexOf(this._backendUrl) === 0);
    };

    /**
     * $http interceptor that adds the Authorization header for
     * requests to the backend API.
     * @param config
     * @returns config
     * @private
     */
    SessionService.prototype._interceptRequest = function(config) {
        if (this._isBackendRequest(config) && this.hasValidSession()) {
            config.headers.Authorization = 'VeganautBearer ' + this._sid;
        }
        return config;
    };

    /**
     * $http interceptor that destroys the session when a call to the
     * backend API returned a 401.
     * @param rejection
     * @returns {promise}
     * @private
     */
    SessionService.prototype._interceptResponseError = function(rejection) {
        // If there was an access denied error, destroy the session
        if (this._isBackendRequest(rejection.config) && rejection.status === 401) {
            this.destroySession();
        }
        return this._$q.reject(rejection);
    };

    // Create session module
    var module = angular.module('veganaut.app.session', []);

    // Register the sessionService
    module.service('sessionService', ['$q', '$rootScope', 'backendUrl', SessionService]);

    // Register the interceptor
    module.factory('sessionHttpInterceptor', ['sessionService',
        function(sessionService) {
            return {
                request: sessionService._interceptRequest.bind(sessionService),
                responseError: sessionService._interceptResponseError.bind(sessionService)
            };
        }
    ]);

    // Add the interceptor
    module.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionHttpInterceptor');
    }]);
})();
