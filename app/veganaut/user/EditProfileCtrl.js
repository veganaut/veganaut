(function(module) {
    'use strict';

    module.controller('EditProfileCtrl', ['$scope', 'alertService', 'playerService', 'translateService',
        function($scope, alertService, playerService, trans) {
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
                playerService.updateMe(form.email, form.fullName, form.nickname, form.password)
                    .success(function() {
                        alertService.addAlert(trans('message.profile.update.success'), 'success');
                    })
                    .error(function() {
                        alertService.addAlert(trans('message.profile.update.error'), 'danger');
                    })
                ;
                $scope.goToView('me');
            };
        }])
    ;
})(window.veganaut.userModule);
