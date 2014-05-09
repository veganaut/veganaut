(function(servicesModule) {
    'use strict';

    /**
     * playerService makes the player available. It will automatically request
     * the player from the backend as soon as it makes sense to do so.
     */
    servicesModule.factory('playerService', ['$rootScope', 'backendService', function($rootScope, backendService) {
        /**
         * Player object. The object reference will always be kept, only the
         * data on it changes. This allows the view to directly bind to it
         * and get all updates.
         * @type {{}}
         */
        var me = {};

        var getMe = function() {
            return me;
        };

        var resetMe = function() {
            // Remove all the properties from the object
            for (var key in me) {
                if (me.hasOwnProperty(key)) {
                    me[key] = undefined;
                }
            }
        };

        var updateData = function() {
            // Request the player from the backend
            backendService.getMe()
                .success(function(data) {
                    // Reset the current player data
                    resetMe();

                    // Add all the received properties to the me object. Don't
                    // replace the whole object, so that the reference stays.
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            me[key] = data[key];
                        }
                    }
                })
                .error(function() {
                    resetMe();
                    // TODO: handle error
                })
            ;
        };

        // Subscribe to login and logout events
        $rootScope.$onRootScope('monkey.backend.session.login', updateData);
        $rootScope.$onRootScope('monkey.backend.session.logout', resetMe);

        // Check if we are logged in already
        if (backendService.isLoggedIn()) {
            updateData();
        }

        // Expose methods
        return {
            getMe: getMe
        };
    }]);
})(window.monkeyFace.servicesModule);
