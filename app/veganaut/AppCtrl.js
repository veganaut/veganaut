(function(controllersModule) {
    'use strict';

    controllersModule.controller('AppCtrl', ['$scope', '$location', 'backendService', 'playerService', 'alertService',
        function($scope, $location, backendService, playerService, alertService) {
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
                    })
                ;
            };

            // Holds the logged in user data
            $scope.me = playerService.getMe();

            // Expose the activity verb method
            $scope.getActivityVerb = playerService.getActivityVerb;

            // Expose alerts
            $scope.getAlerts = alertService.getAlerts;
            $scope.closeAlert = alertService.removeAlert;
        }
    ]);
})(window.monkeyFace.controllersModule);
