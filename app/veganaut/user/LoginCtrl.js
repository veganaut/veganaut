(function(module) {
    'use strict';

    module.controller('LoginCtrl', ['$scope', '$translate', 'backendService', 'alertService',
        function($scope, $translate, backendService, alertService) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('');
            }

            $scope.submit = function() {
                backendService.login($scope.form.email, $scope.form.password)
                    .success(function () {
                        if (backendService.isLoggedIn()) {
                            $scope.goToView('map/');
                        }
                    })
                    .error(function (data) {
                        alertService.addAlert($translate.instant('message.login.error', {
                            reason: data.error
                        }), 'danger');
                    })
                ;
            };
        }
    ]);
})(window.veganaut.userModule);
