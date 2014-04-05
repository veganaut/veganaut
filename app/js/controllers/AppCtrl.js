(function(controllersModule) {
    'use strict';

    controllersModule.controller('AppCtrl', ['$scope', '$location', 'backend', 'alertProvider',
        function($scope, $location, backend, alertProvider) {
            $scope.goToView = function(view) {
                $scope.menuShown = false;
                $location.path(view);
            };

            // Expose some backend states
            $scope.isLoggedIn = backend.isLoggedIn;
            $scope.canViewGraph = backend.canViewGraph;

            $scope.menuShown = false;

            $scope.logout = function() {
                backend.logout()
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
                    backend.getMe()
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
            $scope.getAlerts = alertProvider.getAlerts;
            $scope.closeAlert = alertProvider.removeAlert;
        }
    ]);
})(window.monkeyFace.controllersModule);
