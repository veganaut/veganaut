(function(module) {
    'use strict';

    /**
     * Directive for the registration of new users.
     */
    module.directive('vgRegister', function() {
        return {
            restrict: 'E',
            scope: {},
            controller: registerCtrl,
            controllerAs: 'registerVm',
            bindToController: true,
            templateUrl: '/veganaut/user/register.tpl.html'
        };
    });

    var registerCtrl = [
        '$location', '$translate', 'backendService', 'alertService',
        'localeService', 'angularPiwik', 'nameGeneratorService',
        function($location, $translate, backendService, alertService,
            localeService, angularPiwik, nameGeneratorService)
        {
            var vm = this;

            /**
             * Form values
             * @type {{email: string, nickname: string}}
             */
            vm.form = {
                email: '',
                nickname: nameGeneratorService.generateNickname()
            };

            /**
             * Submit the registration form
             */
            vm.submit = function() {
                // Get the registration values
                var email = vm.form.email;
                var nickname = vm.form.nickname;
                var locale = localeService.getLocale();

                // Do the registration
                backendService.register(email, nickname, locale)
                    .then(function() {
                        // Show the success message longer than usual (it's a longer text)
                        alertService.addAlert($translate.instant('message.registration.success', {
                            name: nickname
                        }), 'success', '', 10000);

                        angularPiwik.track('registration', 'registration.success');

                        // Request a password "reset"
                        backendService.sendPasswordResetMail(email, true);

                        // Go to the panorama
                        $location.url('/panorama/');
                    }, function(data) {
                        alertService.addAlert($translate.instant('message.registration.error', {
                            reason: data.error
                        }), 'danger');
                        angularPiwik.track('registration', 'registration.error');
                    })
                ;
            };
        }
    ];
})(window.veganaut.userModule);
