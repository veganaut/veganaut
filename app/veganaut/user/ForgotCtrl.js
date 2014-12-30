(function(module) {
    'use strict';

    module.controller('ForgotCtrl', ['$scope', 'backendService', 'alertService',
        function($scope, backendService, alertService) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('');
            }

            $scope.submit = function() {
                backendService.sendPasswordResetMail($scope.form.email)
                    .success(function () {
                        // TODO: translate message
                        alertService.addAlert('Sent email!', 'success');
                    })
                    .error(function (response) {
                        alertService.addAlert(response.error, 'danger');
                    })
                ;

            };
        }
    ]);
})(window.veganaut.userModule);
