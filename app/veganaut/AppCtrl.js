(function(module) {
    'use strict';

    module.controller('AppCtrl', ['$scope', '$location', '$window', 'backendService', 'playerService',
        function($scope, $location, $window, backendService, playerService) {
            $scope.goToView = function(view) {
                $scope.menuShown = false;
                $location.path(view);
            };

            $scope.goToBlog = function() {
                $scope.menuShown = false;
                $window.open('http://blog.veganaut.net');
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

            // Get the logged in user data
            playerService.getMe().then(function(me) {
                $scope.me = me;
            });

            // Expose the activity verb method
            $scope.getActivityVerb = playerService.getActivityVerb;
        }
    ]);
})(window.veganaut.mainModule);
