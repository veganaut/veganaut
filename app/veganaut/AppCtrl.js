(function(controllersModule) {
    'use strict';

    controllersModule.controller('AppCtrl', ['$scope', '$location', '$window', 'backendService', 'playerService', 'alertService',
        function($scope, $location, $window, backendService, playerService, alertService) {
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

            // Expose alerts
            $scope.getAlerts = alertService.getAlerts;
            $scope.closeAlert = alertService.removeAlert;
        }
    ]);
})(window.monkeyFace.controllersModule);
