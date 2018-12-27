(function(module) {
    'use strict';

    module.controller('LoginCtrl', ['$scope', '$translate', 'angularPiwik', 'backendService', 'alertService',
        function($scope, $translate, angularPiwik, backendService, alertService) {
            if (backendService.isLoggedIn()) {
                $scope.goToView('/');
            }

            $scope.submit = function() {
                backendService.login($scope.form.email, $scope.form.password)
                    .then(function () {
                        if (backendService.isLoggedIn()) {
                            angularPiwik.track('login', 'login.success');
                            $scope.goToView('/panorama/');
                        }
                    }, function (data) {
                        angularPiwik.track('login', 'login.error');
                        alertService.addAlert($translate.instant('message.login.error', {
                            reason: data.error
                        }), 'danger');
                    })
                ;
            };
        }
    ]);
})(window.veganaut.userModule);
