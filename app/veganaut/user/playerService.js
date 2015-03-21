(function(module) {
    'use strict';

    /**
     * playerService makes the player available. It will automatically request
     * the player from the backend as soon as it makes sense to do so.
     */
    module.factory('playerService', ['$rootScope', '$q', 'backendService', function($rootScope, $q, backendService) {
        var PlayerService = function() {
            /**
             * Player object. The object reference will always be kept, only the
             * data on it changes. This allows the view to directly bind to it
             * and get all updates.
             * @type {{}}
             * @private
             */
            this._me = {};

            /**
             * Deferred for the player object
             * @type {Deferred}
             * @private
             */
            this._deferredMe = $q.defer();

            /**
             * Whether we are currently able to reload the data
             * (this means we must have already loaded it once and it
             * must not currently be loading it)
             * @type {boolean}
             * @private
             */
            this._canReloadData = false;

            // Subscribe to session created event to get the user data
            $rootScope.$onRootScope('veganaut.session.created', this._retrieveFromBackend.bind(this));

            // Check if we are logged in already
            if (backendService.isLoggedIn()) {
                this._retrieveFromBackend();
            }
        };


        /**
         * Gets the player data
         * @param {boolean} [forceReload=false] Reload the data from the backend
         * @returns {promise}
         */
        PlayerService.prototype.getMe = function(forceReload) {
            if (forceReload === true && this._canReloadData) {
                // Create a new deferred
                this._deferredMe = $q.defer();

                // Get th data
                this._retrieveFromBackend();
            }
            return this._deferredMe.promise;
        };

        /**
         * Removes all properties from the stored player
         * @private
         */
        PlayerService.prototype._resetMe = function() {
            // Remove all the properties from the object
            for (var key in this._me) {
                if (this._me.hasOwnProperty(key)) {
                    this._me[key] = undefined;
                }
            }
        };

        /**
         * Sets the given data as the new player data
         * @param data
         * @private
         */
        PlayerService.prototype._setPlayerData = function(data) {
            // Reset the current player data
            this._resetMe();

            // Add all the received properties to the me object. Don't
            // replace the whole object, so that the reference stays.
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    this._me[key] = data[key];
                }
            }

            // Resolve the promise
            this._deferredMe.resolve(this._me);
        };

        /**
         * Retrieves the player data from the backend
         * @private
         */
        PlayerService.prototype._retrieveFromBackend = function() {
            // Request the player from the backend
            var that = this;
            that._canReloadData = false;
            backendService.getMe()
                .success(that._setPlayerData.bind(that))
                .error(function() {
                    that._resetMe();
                    // TODO: handle error
                })
                .finally(function() {
                    that._canReloadData = true;
                })
            ;
        };

        /**
         * Updates the current player info.
         *
         * @param {{}} newPlayerData
         */
        PlayerService.prototype.updateMe = function(newPlayerData) {
            return backendService.updateMe(newPlayerData)
                .success(this._setPlayerData.bind(this))
            ;
        };

        /**
         * Returns the verb used to describe making an activity with the
         * given target
         *
         * @param target
         * @returns {string}
         */
        PlayerService.prototype.getActivityVerb = function(target) {
            if (target.isDummy() || target.isMaybe() || target.isBaby()) {
                // Attract new players
                return 'attract';
            }
            else if (this._me.team === target.team) {
                // Support your own team
                return 'support';
            }
            else {
                // Tempt the other team or the default if you don't have a full account (e.g. as a maybe)
                return 'tempt';
            }
        };

        // Returns singleton instance
        return new PlayerService();
    }]);
})(window.veganaut.userModule);
