(function(module) {
    'use strict';

    module.controller('LoginCtrl', ['$scope', 'backendService', 'alertService',
        function($scope, backendService, alertService) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('');
            }

            $scope.submit = function() {
                backendService.login($scope.form.email, $scope.form.password)
                    .success(function () {
                        if (backendService.isLoggedIn()) {
                            $scope.goToView('map');
                        }
                    })
                    .error(function (data) {
                        // TODO: showing the error to the user should be done by the backend service
                        alertService.addAlert('Could not log in: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.veganaut.userModule);
