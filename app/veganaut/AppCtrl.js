(function(controllersModule) {
    'use strict';

    controllersModule.controller('AppCtrl', ['$scope', '$location', 'backendService', 'alertService',
        function($scope, $location, backendService, alertService) {
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
                        $scope.goToView('login');
                    })
                ;
            };

            // Holds the logged in user data
            $scope.me = {};

            // Get the user data as soon as we are logged in
            $scope.$watch('isLoggedIn()', function(isLoggedIn) {
                if (isLoggedIn) {
                    backendService.getMe()
                        .success(function(data) {
                            $scope.me = data;
                        })
                    ;
                }
                else {
                    // Reset the player
                    $scope.me = {};
                }
            });

            // Expose alerts
            $scope.getAlerts = alertService.getAlerts;
            $scope.closeAlert = alertService.removeAlert;
        }
    ]);
})(window.monkeyFace.controllersModule);
