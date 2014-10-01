(function(module) {
    'use strict';

    module.controller('AppCtrl', ['$scope', '$location', '$window', 'angularPiwik', 'backendService', 'playerService',
        function($scope, $location, $window, angularPiwik, backendService, playerService) {
            $scope.goToView = function(view) {
                $scope.menuShown = false;
                $location.path(view);
            };

            // Expose some backend states and methods
            $scope.isLoggedIn = backendService.isLoggedIn;
            $scope.canViewGraph = backendService.canViewGraph;
            $scope.logout = backendService.logout;

            $scope.menuShown = false;

            // Reload the whole app when the session gets destroyed to clear all data
            $scope.$onRootScope('veganaut.session.destroyed', function() {
                $window.location.reload();
            });

            // Listen to route chagnes to track page views
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
