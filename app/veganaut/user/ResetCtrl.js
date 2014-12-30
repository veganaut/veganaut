(function (module) {
    'use strict';

    module.controller('ResetCtrl', [
        '$scope', '$routeParams', '$location', 'backendService', 'alertService', 'translateService',
        function ($scope, $routeParams, $location, backendService, alertService, t) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('');
            }

            var token = $routeParams.token;

            /**
             * Whether the we got a valid token
             * @type {boolean}
             */
            $scope.validToken = false;

            // Check if the token is valid
            backendService.isValidToken(token)
                .success(function() {
                    $scope.validToken = true;
                }).error(function() {
                    alertService.addAlert(t('message.resetPassword.invalidToken'), 'danger');
                    $location.path('/forgot');
                })
            ;

            $scope.submit = function () {
                backendService.resetPassword(token, $scope.form.password)
                    .success(function() {
                        alertService.addAlert(t('message.resetPassword.success'), 'success');
                        $location.path('/login');
                    })
                    .error(function(response) {
                        alertService.addAlert(response.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.veganaut.userModule);
