(function(module) {
    'use strict';

    module.controller('EditProfileCtrl', ['$scope', '$translate', 'alertService', 'playerService',
        function($scope, $translate, alertService, playerService) {
            playerService.getMe().then(function(me) {
                $scope.form = {
                    fullName: me.fullName,
                    nickname: me.nickname,
                    email: me.email,
                    password: '',
                    passwordRepeat: ''
                };

                $scope.changePassword = false;
            });

            $scope.submit = function() {
                var form = $scope.form;
                // TODO: improve how the form validates password and passwordRepeat are the same
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
