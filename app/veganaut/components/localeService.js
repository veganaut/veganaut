(function(module) {
    'use strict';
    module.factory('localeService', ['$window', '$translate', 'i18nSettings', 'playerService',
        function($window, $translate, i18nSettings, playerService) {
            /**
             * Id used for storing the locale in local storage
             * @type {string}
             */
            var LOCALE_STORAGE_ID = 'veganautLocale';

            /**
             * Locale service keeps track of the currently used
             * locale and updates keeps the local storage and the
             * player in sync.
             * @constructor
             */
            var LocaleService = function() {
                /**
                 * Whether we should save the locale to the user.
                 * This is only true once the locale from the player
                 * has been loaded.
                 * @type {boolean}
                 * @private
                 */
                this._canSaveToPlayer = false;

                // Load the locale from the local storage and player
                // TODO: $translate already decided on a language and this might change it immediately, causing two locale files to be loaded
                this._loadLocalStorageLocale();
                this._loadPlayerLocale();
            };

            /**
             * Sets the locale from the value stored in local storage
             * @private
             */
            LocaleService.prototype._loadLocalStorageLocale = function() {
                this.changeLocale($window.localStorage.getItem(LOCALE_STORAGE_ID));
            };

            /**
             * Gets the player and sets the locale based on that
             * @private
             */
            LocaleService.prototype._loadPlayerLocale = function() {
                var that = this;
                playerService.getMe().then(function(me) {
                    that.changeLocale(me.locale);
                    that._canSaveToPlayer = true;
                });
            };

            /**
             * Saves the current locale to the player.
             * This is only done once the locale from the player has
             * been read for the first time.
             * @private
             */
            LocaleService.prototype._updatePlayerLocale = function() {
                var that = this;
                if (that._canSaveToPlayer) {
                    playerService.getMe().then(function(me) {
                        // Update the locale if it's different than the current one
                        var currentLocale = that.getLocale();
                        if (me.locale !== currentLocale) {
                            playerService.updateMe({
                                locale: currentLocale
                            });
                        }
                    });
                }
            };

            /**
             * Tries to change the locale to the given one.
             * Updates the player as soon as one is available.
             * @param {string} locale
             * @returns {boolean} Whether the given locale was valid
             */
            LocaleService.prototype.changeLocale = function(locale) {
                if (i18nSettings.availableLocales.indexOf(locale) >= 0) {
                    $translate.use(locale);
                    this._updatePlayerLocale();

                    $window.localStorage.setItem(LOCALE_STORAGE_ID, locale);
                    return true;
                }
                return false;
            };

            /**
             * Returns the currently used locale
             * @returns {string}
             */
            LocaleService.prototype.getLocale = function() {
                // Return the proposed language if it exists (meaning it hasn't been loaded)
                // or otherwise the actual used one
                return $translate.proposedLanguage() || $translate.use();
            };

            return new LocaleService();
        }
    ]);
})(window.veganaut.mainModule);
