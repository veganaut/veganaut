(function(module) {
    'use strict';

    /**
     * playerService makes the player available. It will automatically request
     * the player from the backend as soon as it makes sense to do so.
     */
    module.factory('playerService', ['$rootScope', '$q', 'backendService', function($rootScope, $q, backendService) {
        /**
         * Player object. The object reference will always be kept, only the
         * data on it changes. This allows the view to directly bind to it
         * and get all updates.
         * @type {{}}
         */
        var me = {};

        /**
         * Deferred for the player object
         * @type {Deferred}
         */
        var deferredMe = $q.defer();

        var getMe = function() {
            return deferredMe.promise;
        };

        var resetMe = function() {
            // Remove all the properties from the object
            for (var key in me) {
                if (me.hasOwnProperty(key)) {
                    me[key] = undefined;
                }
            }
        };

        /**
         * Sets the given data as the new player data
         * @param data
         */
        var setPlayerData = function(data) {
            // Reset the current player data
            resetMe();

            // Add all the received properties to the me object. Don't
            // replace the whole object, so that the reference stays.
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    me[key] = data[key];
                }
            }

            // Resolve the promise
            deferredMe.resolve(me);
        };

        var retrieveFromBackend = function() {
            // Request the player from the backend
            backendService.getMe()
                .success(setPlayerData)
                .error(function() {
                    resetMe();
                    // TODO: handle error
                })
            ;
        };

        /**
         * Updates the current player info
         *
         * @param email
         * @param fullName
         * @param nickname
         * @param password
         */
        var updateMe = function(email, fullName, nickname, password) {
            return backendService.updateMe(email, fullName, nickname, password)
                .success(setPlayerData)
            ;
        };

        /**
         * Returns the verb used to describe making an activity with the
         * given target
         *
         * @param target
         * @returns {string}
         */
        var getActivityVerb = function(target) {
            if (target.isDummy() || target.isMaybe() || target.isBaby()) {
                // Attract new players
                return 'attract';
            }
            else if (me.team === target.team) {
                // Support your own team
                return 'support';
            }
            else {
                // Tempt the other team or the default if you don't have a full account (e.g. as a maybe)
                return 'tempt';
            }
        };

        // Subscribe to login and logout events
        $rootScope.$onRootScope('monkey.backend.session.login', retrieveFromBackend);
        $rootScope.$onRootScope('monkey.backend.session.logout', resetMe);

        // Check if we are logged in already
        if (backendService.isLoggedIn()) {
            retrieveFromBackend();
        }

        // Expose methods
        return {
            getMe: getMe,
            updateMe: updateMe,
            getActivityVerb: getActivityVerb
        };
    }]);
})(window.veganaut.userModule);
