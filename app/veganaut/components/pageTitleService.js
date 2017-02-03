(function() {
    'use strict';
    angular.module('veganaut.app.main').factory('pageTitleService', [
        '$rootScope', '$translate',
        function($rootScope, $translate) {

            /**
             * Default page title part always present
             * @type {string}
             */
            var DEFAULT_PAGE_TITLE = 'Veganaut.net';

            /**
             * Name Generator is a simple service that generates pseudo random names
             * @constructor
             */
            var PageTitleService = function() {
                var that = this;

                /**
                 * Current route name
                 * @type {string}
                 * @private
                 */
                that._routeName = undefined;

                /**
                 * Custum title part set through addCustomTitle()
                 * @type {string}
                 * @private
                 */
                that._customTitle = undefined;

                // Listen to route changes to update the title
                $rootScope.$on('$routeChangeSuccess', function(event, newRoute) {
                    // Reset titles
                    that._routeName = undefined;
                    that._customTitle = undefined;

                    // Set route name, if it's valid
                    if (_.isObject(newRoute) && _.isString(newRoute.vgRouteName)) {
                        that._routeName = newRoute.vgRouteName;
                    }
                });
            };

            /**
             * Returns the string to be used for the page title
             * @returns {string}
             */
            PageTitleService.prototype.getPageTitle = function() {
                // TODO: we shouldn't read this on the $rootScope, but from a service
                if (!$rootScope.isInitialised) {
                    // As long as we are not initialised (no translations loaded),
                    // we return just the default title.
                    return DEFAULT_PAGE_TITLE;
                }

                // Collect the different title parts
                var titles = [DEFAULT_PAGE_TITLE];

                if (angular.isString(this._routeName)) {
                    // Translate and add the route-based title
                    titles.push($translate.instant('pageTitle.' + this._routeName));
                }

                if (angular.isString(this._customTitle)) {
                    titles.push(this._customTitle);
                }

                // Reverse and add them together (default title goes last)
                return titles.reverse().join(' | ');
            };

            /**
             * Adds a custom title part.
             * @param {string} title
             */
            PageTitleService.prototype.addCustomTitle = function(title) {
                this._customTitle = title;
            };

            return new PageTitleService();
        }
    ]);
})();
