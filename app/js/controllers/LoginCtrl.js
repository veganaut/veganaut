(function(controllersModule) {
    'use strict';

    controllersModule.controller('LoginCtrl', ['$scope', 'backend', 'alertProvider',
        function($scope, backend, alertProvider) {
            if (backend.isLoggedIn()) {
                $scope.goToView('socialGraph');
            }

            $scope.submit = function() {
                backend.login($scope.form.email, $scope.form.password)
                    .success(function () {
                        if (backend.isLoggedIn()) {
                            $scope.goToView('socialGraph');
                        }
                    })
                    .error(function (data) {
                        // TODO: showing the error to the user should be done by the backend service
                        alertProvider.addAlert('Could not log in: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);
})(window.monkeyFace.controllersModule);
