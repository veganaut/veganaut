(function(module) {
    'use strict';

    module.controller('AppCtrl', [
        '$scope', '$location', '$window',
        'angularPiwik', 'featureToggle',
        'backendService', 'playerService', 'localeService',
        function($scope, $location, $window,
            angularPiwik, featureToggle,
            backendService, playerService, localService)
        {
            // Expose feature toggle settings
            $scope.featureToggle = featureToggle;

            // Expose the location service
            $scope.$location = $location;

            $scope.isEmbedded = true;

            $scope.closeMenu = function() {
                $scope.menuShown = false;
            };

            $scope.goToView = function(view) {
                $scope.closeMenu();
                $location.path(view);
            };

            // Expose some backend states and methods
            $scope.isLoggedIn = backendService.isLoggedIn.bind(backendService);
            $scope.canViewGraph = backendService.canViewGraph.bind(backendService);
            $scope.logout = backendService.logout.bind(backendService);

            $scope.menuShown = false;

            // Reload the whole app when the session gets destroyed to clear all data
            $scope.$onRootScope('veganaut.session.destroyed', function() {
                $window.location.reload();
            });

            // Listen to route changes to track page views
            $scope.$onRootScope('$routeChangeSuccess', function() {
                // Get the current value of the accountType piwik custom variable
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

            // Get the logged in user data
            playerService.getMe().then(function(me) {
                $scope.me = me;
            });

            // Expose the activity verb method
            $scope.getActivityVerb = playerService.getActivityVerb;

            // Calculate the logo url, see the template for more explanation
            // Cannot use $location.absUrl() because we need the URL without search & hash
            $scope.logoUrl = $location.protocol() + '://' + $location.host();
            var port = $location.port();
            if (port !== 80) {
                $scope.logoUrl += ':' + port;
            }
            $scope.logoUrl += $location.path() + '#veganaut';
        }
    ]);
})(window.veganaut.mainModule);
