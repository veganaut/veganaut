(function(module) {
    'use strict';

    module.controller('EditProfileCtrl', ['$scope', '$translate', 'alertService', 'playerService',
        function($scope, $translate, alertService, playerService) {
            playerService.getDeferredMe().then(function(me) {
                $scope.form = {
                    fullName: me.fullName,
                    nickname: me.nickname,
                    email: me.email,
                    password: ''
                };

                $scope.changePassword = false;
            });

            $scope.submit = function() {
                var form = $scope.form;

                // Don't send the password if the user doesn't want to change it
                if (!$scope.changePassword) {
                    delete form.password;
                }

                playerService.updateMe(form)
                    .success(function() {
                        alertService.addAlert($translate.instant('message.profile.update.success'), 'success');
                    })
                    .error(function() {
                        alertService.addAlert($translate.instant('message.profile.update.error'), 'danger');
                    })
                ;
                $scope.goToView('me');
            };
        }])
    ;
})(window.veganaut.userModule);
