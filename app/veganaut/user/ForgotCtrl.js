(function(module) {
    'use strict';

    module.controller('ForgotCtrl', [
        '$scope', 'backendService', 'alertService', 'translateService',
        function($scope, backendService, alertService, t) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('');
            }

            $scope.submit = function() {
                backendService.sendPasswordResetMail($scope.form.email)
                    .success(function() {
                        alertService.addAlert(t('message.resetPassword.emailSent'), 'success');
                    })
                    .error(function(response) {
                        alertService.addAlert(response.error, 'danger');
                    })
                ;

            };
        }
    ]);
})(window.veganaut.userModule);
