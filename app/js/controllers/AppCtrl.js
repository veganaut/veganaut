(function(controllersModule) {
    'use strict';

    controllersModule.controller('AppCtrl', ['$scope', '$location', 'backend', 'alertProvider',
        function($scope, $location, backend, alertProvider) {
            $scope.goToView = function(view) {
                $location.path(view);
            };

            // Expose some backend states
            $scope.isLoggedIn = backend.isLoggedIn;
            $scope.canViewGraph = backend.canViewGraph;

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

            $scope.submitReferenceCode = function() {
                backend.submitReferenceCode($scope.form.referenceCode)
                    .success(function() {
                        alertProvider.addAlert('Successfully submitted reference code', 'success');

                        // Reset form
                        $scope.form.referenceCode = '';

                        // Publish that the graph data has changed
                        $scope.$root.$emit('monkey.socialGraph.dataChanged');

                        // Show the graph
                        $scope.goToView('socialGraph');
                    })
                    .error(function(data) {
                        alertProvider.addAlert('Could not submit reference code: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
