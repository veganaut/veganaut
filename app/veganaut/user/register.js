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
        '$location', 'backendService', 'alertService', 'localeService', 'angularPiwik', 'nameGeneratorService',
        function($location, backendService, alertService, localeService, angularPiwik, nameGeneratorService) {
            var vm = this;

            /**
             * Form values
             * @type {{email: string, nickname: string, password: string}}
             */
            vm.form = {
                email: '',
                nickname: nameGeneratorService.generateNickname(),
                password: ''
            };

            /**
             * Whether to show the password (input type text or password)
             * @type {boolean}
             */
            vm.showPassword = false;

            /**
             * Toggle showing the password
             */
            vm.toggleShowPassword = function() {
                vm.showPassword = !vm.showPassword;
            };

            /**
             * Submit the registration form
             */
            vm.submit = function() {
                backendService.register(vm.form.email, vm.form.nickname, vm.form.password, localeService.getLocale())
                    .success(function() {
                        alertService.addAlert('Registered successfully', 'success');
                        angularPiwik.track('registration', 'registration.success');

                        // TODO: code duplication with LoginController
                        backendService.login(vm.form.email, vm.form.password)
                            .success(function() {
                                if (backendService.isLoggedIn()) {
                                    $location.path('map');
                                }
                            })
                            .error(function(data) {
                                alertService.addAlert('Could not log in: ' + data.error, 'danger');
                            })
                        ;
                    })
                    .error(function(data) {
                        alertService.addAlert('Could not register: ' + data.error, 'danger');
                        angularPiwik.track('registration', 'registration.error');
                    })
                ;
            };
        }
    ];
})(window.veganaut.userModule);
