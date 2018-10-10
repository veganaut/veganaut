(function(module) {
    'use strict';

    module.controller('AppCtrl', [
        '$rootScope', '$scope', '$location', '$window', '$q', 'alertService',
        'angularPiwik', 'featureToggle', 'searchService', 'pageTitleService',
        'backendService', 'playerService', 'localeService',
        function($rootScope, $scope, $location, $window, $q, alertService,
            angularPiwik, featureToggle, searchService, pageTitleService,
            backendService, playerService, localService)
        {
            /**
             * Whether the app has finished initialising
             * (= translations are loaded)
             * @type {boolean}
             */
            $rootScope.isInitialised = false;

            // Expose services
            $scope.featureToggle = featureToggle;
            $scope.$location = $location;
            $scope.pageTitleService = pageTitleService;

            // Whether the app is embedded (in an iframe)
            // If that is the case, only the map can be used and the navbar is not shown
            // TODO: Add tests for this mode, it contains quite a few tricky changes
            $scope.isEmbedded = ($location.search()['mode'] === 'embedded');

            $scope.closeMenu = function() {
                $scope.menu.shown = false;
            };

            $rootScope.goToView = $scope.goToView = function(view) {
                $scope.closeMenu();
                $location.path(view);
            };

            // Expose some backend states and methods
            $scope.isLoggedIn = backendService.isLoggedIn.bind(backendService);
            $scope.logout = function() {
                backendService.logout().finally(function() {
                    angularPiwik.track('logout', 'logout.success');
                });
            };

            $scope.menu = {
                shown: false
            };

            /**
             * Handler for clicks on search button in navbar
             */
            $scope.searchClick = function() {
                searchService.toggleSearchModal();
            };

            // Reload the whole app when the session gets destroyed to clear all data
            $scope.$on('veganaut.session.destroyed', function() {
                $window.location.reload();
            });

            // Listen to route changes to track page views
            $scope.$on('$routeChangeSuccess', function() {
                // Get the current complete URL that will be tracked
                var absUrl = $location.absUrl();

                // Get the current value of the accountType and entryMode Piwik custom variables
                // TODO: should only track if "newRoute.redirectTo" is not set? Or track differently if it is
                $q.all({
                    accountType: angularPiwik.getCustomVariable(1, 'visit'),
                    entryMode: angularPiwik.getCustomVariable(3, 'visit')
                }).then(function(customVars) {
                    // Check what we previously stored as account type and entry mode
                    var previousAccountType, previousEntryMode;
                    if (angular.isArray(customVars.accountType)) {
                        previousAccountType = customVars.accountType[1];
                    }
                    if (angular.isArray(customVars.entryMode)) {
                        previousEntryMode = customVars.entryMode[1];
                    }

                    // Check what we now would store as account type
                    var newAccountType = $scope.isLoggedIn() ? 'user' : 'none';

                    // Set the account type if it wasn't set already or if it's now a user
                    // (meaning we never want to go back from 'user' to 'none'
                    if (!angular.isString(previousAccountType) || newAccountType === 'user') {
                        angularPiwik.setCustomVariable(1, 'accountType', newAccountType, 'visit');
                    }

                    // Set the current locale
                    angularPiwik.setCustomVariable(2, 'locale', localService.getLocale(), 'visit');

                    // Set the mode (for the visit and the page)
                    var newMode = $scope.isEmbedded ? 'embedded' : 'default';
                    if (!angular.isString(previousEntryMode)) {
                        // The entry mode is only set once
                        angularPiwik.setCustomVariable(3, 'entryMode', newMode, 'visit');
                    }
                    angularPiwik.setCustomVariable(1, 'mode', newMode, 'page');

                    // Finally, track the page view
                    angularPiwik.trackPageView(absUrl, pageTitleService.getPageTitle());
                });
            });

            // If we're embedded, all links outside the map should open in a new window
            if ($scope.isEmbedded) {
                // We need to store the last URL we changed to, so we can reset back to it
                // in the handler of $routeChangeStart.
                var lastUrl;
                $scope.$on('$locationChangeSuccess', function() {
                    lastUrl = $location.url();
                });

                $scope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
                    // Check if we would leave the map
                    if (newRoute.vgRouteName !== 'map') {
                        // Check if there was already an old route defined (indicating the app hasn't just loaded)
                        if (angular.isDefined(oldRoute)) {
                            // The user is trying to navigate away from the map.
                            // We want to open a new window instead
                            event.preventDefault();

                            // For the URL we want to open in a new window we don't want many of the parameters
                            // that are set on the embedded map. We use Angular's $location service to manipulate
                            // the URL easily and get the cleaned target. But we need to reset the URL here after,
                            // because we don't really want to make a route change.
                            $location
                                .hash(null)
                                .search('mode', null)
                                .search('pk_campaign', null)
                                .search('pk_cpn', null)
                                .search('pk_kwd', null)
                            ;
                            // Note: If this code is every moved to a service, we need to make sure the listeners in
                            // the mainMapService and locationFilterService are still executed first, so the
                            // corresponding params are reset.

                            // Open the new window with the cleaned URL
                            $window.open($location.absUrl());

                            // Restore the old URL so we don't trigger another location change
                            $location.url(lastUrl);
                        }
                        else {
                            // App has just loaded but not on the map. Redirect to the map
                            $location.path('/map/');
                        }
                    }
                });
            }

            // Listen to translation changes to set the app to initialised
            $rootScope.$on('$translateChangeEnd', function() {
                $rootScope.isInitialised = true;
            });

            // Get the logged in user data
            playerService.getDeferredMe().then(function(me) {
                $scope.me = me;
            });

            alertService.addAlert(
                'INFO: Due to a major update, Veganaut is currently in read-only mode.',
                'warning', '', 60000
            );
        }
    ]);
})(window.veganaut.mainModule);
