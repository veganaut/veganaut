(function(controllersModule) {
    'use strict';

    controllersModule.controller('LoginCtrl', ['$scope', 'backendService', 'alertService',
        function($scope, backendService, alertService) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('socialGraph');
            }

            $scope.submit = function() {
                backendService.login($scope.form.email, $scope.form.password)
                    .success(function () {
                        if (backendService.isLoggedIn()) {
                            $scope.goToView('socialGraph');
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
})(window.monkeyFace.controllersModule);
