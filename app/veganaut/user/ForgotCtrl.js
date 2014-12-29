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
                        alertService.addAlert('Sent email! ', 'success');
                    })
                    .error(function () {
                        alertService.addAlert('Something went wrong when sending the email! ', 'alert');
                    })
                ;

            };
        }
    ]);
})(window.veganaut.userModule);
