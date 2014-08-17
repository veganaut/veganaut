(function(module) {
    'use strict';

    module.controller('AppCtrl', ['$scope', '$location', '$window', 'backendService', 'playerService',
        function($scope, $location, $window, backendService, playerService) {
            $scope.goToView = function(view) {
                $scope.menuShown = false;
                $location.path(view);
            };

            // Expose some backend states
            $scope.isLoggedIn = backendService.isLoggedIn;
            $scope.canViewGraph = backendService.canViewGraph;

            $scope.menuShown = false;

            $scope.logout = function() {
                backendService.logout()
                    .success(function() {
                        $scope.goToView('');
                        $window.location.reload();
                    })
                ;
            };

            // Get the logged in user data
            playerService.getMe().then(function(me) {
                $scope.me = me;
            });

            // Expose the activity verb method
            $scope.getActivityVerb = playerService.getActivityVerb;
        }
    ]);
})(window.veganaut.mainModule);
