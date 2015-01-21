(function(module) {
    'use strict';

    module.controller('AppCtrl', [
        '$scope', '$location', '$window',
        'angularPiwik', 'featureToggle',
        'backendService', 'playerService',
        function($scope, $location, $window, angularPiwik, featureToggle, backendService, playerService) {
            // Expose feature toggle settings
            $scope.featureToggle = featureToggle;

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
                angularPiwik.trackPageView();
            });

            // Get the logged in user data
            playerService.getMe().then(function(me) {
                $scope.me = me;
            });

            // Expose the activity verb method
            $scope.getActivityVerb = playerService.getActivityVerb;
        }
    ]);
})(window.veganaut.mainModule);
