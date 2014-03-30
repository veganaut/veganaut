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

            // Expose alerts
            $scope.getAlerts = alertProvider.getAlerts;
            $scope.closeAlert = alertProvider.removeAlert;
        }
    ]);
})(window.monkeyFace.controllersModule);
