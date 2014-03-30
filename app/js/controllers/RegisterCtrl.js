(function(controllersModule) {
    'use strict';

    controllersModule.controller('RegisterCtrl', ['$scope', 'backend', 'alertProvider',
        function($scope, backend, alertProvider) {

            // TODO: move somewhere more global
            $scope.roles = ['rookie', 'scout', 'veteran'];

            $scope.submit = function() {
                // TODO: get the form to already validate that password and password repeat should be the same
                if ($scope.form.password === $scope.form.passwordRepeat) {
                    backend.register($scope.form.email, $scope.form.fullName, $scope.form.password, $scope.form.role)
                        .success(function() {
                            alertProvider.addAlert('Registered successfully', 'success');

                            // TODO: code duplication with LoginController
                            backend.login($scope.form.email, $scope.form.password)
                                .success(function () {
                                    if (backend.isLoggedIn()) {
                                        $scope.goToView('socialGraph');
                                    }
                                })
                                .error(function (data) {
                                    alertProvider.addAlert('Could not log in: ' + data.error, 'danger');
                                })
                            ;
                        })
                        .error(function(data) {
                            // TODO: showing the error to the user should be done by the backend service
                            alertProvider.addAlert('Could not register: ' + data.error, 'danger');
                        })
                    ;
                }
            };
        }])
    ;
})(window.monkeyFace.controllersModule);
