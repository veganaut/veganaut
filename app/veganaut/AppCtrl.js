(function(module) {
    'use strict';

    module.controller('AppCtrl', [
        '$scope', '$location', '$window', '$rootScope',
        'angularPiwik', 'featureToggle',
        'backendService', 'playerService', 'localeService',
        function($scope, $location, $window, $rootScope,
            angularPiwik, featureToggle,
            backendService, playerService, localService)
        {
            // Expose feature toggle settings
            $scope.featureToggle = featureToggle;

            // Expose the location service
            $scope.$location = $location;

            // Whether the app is embedded (in an iframe)
            // If that is the case, only the map can be used and the navbar is not shown
            // TODO: Add tests for this mode, it contains quite a few tricky changes
            $scope.isEmbedded = ($location.search()['mode'] === 'embedded');

            $scope.closeMenu = function() {
                $scope.menu.shown = false;
            };

            $scope.goToView = function(view) {
                $scope.closeMenu();
                $location.path(view);
            };

            // Expose some backend states and methods
            $scope.isLoggedIn = backendService.isLoggedIn.bind(backendService);
            $scope.logout = backendService.logout.bind(backendService);

            $scope.menu = {
                shown: false
            };

            /**
             * Handler for clicks on search button in navbar
             */
            $scope.searchClick = function() {
                // This is a temporary solution to handle the search click
                // Is now handled in mainMap, will move to proper directives later
                $rootScope.$emit('veganaut.search.clicked');
            };

            // Reload the whole app when the session gets destroyed to clear all data
            $scope.$onRootScope('veganaut.session.destroyed', function() {
                $window.location.reload();
            });

            // Listen to route changes to track page views
            $scope.$onRootScope('$routeChangeSuccess', function() {
                // Get the current value of the accountType piwik custom variable
                // TODO: should only track if "newRoute.redirectTo" is not set? Or track differently if it is
                angularPiwik.getCustomVariable(1, 'visit').then(function(customVar) {
                    // Check what we previously stored as account type
                    var previousAccountType;
                    if (angular.isArray(customVar)) {
                        previousAccountType = customVar[1];
                    }

                    // Check what we now would store as account type
                    var newAccountType = $scope.isLoggedIn() ? 'user' : 'none';

                    // Set the account type if it wasn't set already or if it's now a user
                    // (meaning we never want to go back from 'user' to 'none'
                    if (angular.isUndefined(previousAccountType) || newAccountType === 'user') {
                        angularPiwik.setCustomVariable(1, 'accountType', newAccountType, 'visit');
                    }

                    // Set the current locale
                    angularPiwik.setCustomVariable(2, 'locale', localService.getLocale(), 'visit');

                    // Finally, track the page view
                    angularPiwik.trackPageView();
                });
            });

            // If we're embedded, all links outside the map should open in a new window
            if ($scope.isEmbedded) {
                $scope.$onRootScope('$routeChangeStart', function(event, newRoute, oldRoute) {
                    var currentPath = $location.path();
                    if (currentPath !== '/map') {
                        // Check if there was already an old route defined,
                        if (angular.isDefined(oldRoute)) {
                            // The user is trying to navigate away from the map.
                            // We want to open a new window instead
                            event.preventDefault();

                            // Get the current url, then remove some parts we don't want in the new window.
                            var oldUrl = $location.url();
                            $location.hash(null);
                            $location.search('mode', null);
                            $location.search('pk_campaign', null);
                            $location.search('pk_cpn', null);
                            $location.search('pk_kwd', null);
                            $window.open($location.absUrl());

                            // Restore the old URL so we don't trigger another location change
                            $location.url(oldUrl);
                        }
                        else {
                            // App has just loaded but not on the map. Redirect to the map
                            $location.path('/map');
                        }
                    }
                });
            }

            // Get the logged in user data
            playerService.getDeferredMe().then(function(me) {
                $scope.me = me;
            });

            /**
             * Returns the logo URL (svg)
             * See the main template for more explanation
             * @returns {string}
             */
            $scope.getLogoUrl = function() {
                // Need to remove the hash from the absolute URL and add the svg id
                return $location.absUrl().replace(/#.*/, '') + '#veganaut';
            };
        }
    ]);
})(window.veganaut.mainModule);
