(function(module) {
    'use strict';

    module.controller('RegisterCtrl', ['$scope', 'backendService', 'alertService',
        function($scope, backendService, alertService) {

            // TODO: improve how the form validates password and passwordRepeat are the same
            $scope.submit = function() {
                backendService.register($scope.form.email, $scope.form.fullName, $scope.form.nickname, $scope.form.password)
                    .success(function() {
                        alertService.addAlert('Registered successfully', 'success');

                        // TODO: code duplication with LoginController
                        backendService.login($scope.form.email, $scope.form.password)
                            .success(function () {
                                if (backendService.isLoggedIn()) {
                                    $scope.goToView('');
                                }
                            })
                            .error(function (data) {
                                alertService.addAlert('Could not log in: ' + data.error, 'danger');
                            })
                        ;
                    })
                    .error(function(data) {
                        // TODO: showing the error to the user should be done by the backend service
                        alertService.addAlert('Could not register: ' + data.error, 'danger');
                    })
                ;
            };
        }])
    ;
})(window.veganaut.userModule);
