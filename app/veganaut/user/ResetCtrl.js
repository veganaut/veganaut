(function (module) {
    'use strict';

    module.controller('ResetCtrl', ['$scope', '$routeParams', 'backendService', 'alertService',
        function ($scope, $routeParams, backendService, alertService) {

            $scope.init = function() {
                backendService.isValidToken($routeParams.token)
                    .success(function () {
                        $scope.validToken = true;
                    }).error(function () {
                        alertService.addAlert('Password reset token is invalid or has expired', 'danger');
                        $scope.validToken = false;
                    });
            };


            $scope.submit = function () {

                backendService.resetPassword($routeParams.token, $scope.form.password)
                    .success(function () {
                        $scope.goToView('');
                    })
                    .error(function () {
                        alertService.addAlert('Could not reset password', 'danger');
                    })
                ;
            };
        }
    ]);
})(window.veganaut.userModule);
