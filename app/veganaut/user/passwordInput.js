(function(module) {
    'use strict';

    /**
     * Directive that renders a password input field
     */
    module.directive('vgPasswordInput', function() {
        return {
            restrict: 'E',
            require: '^form',
            scope: {
                passwordModel: '=vgModel'
            },
            link: function(scope, elm, attr, formCtrl) {
                // TODO: find a better way to get the view access to the form
                scope.formVm = formCtrl;
            },
            controller: passwordInputCtrl,
            controllerAs: 'passwordInputVm',
            bindToController: true,
            templateUrl: '/veganaut/user/passwordInput.tpl.html'
        };
    });

    var passwordInputCtrl = [
        function() {
            var vm = this;

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
        }
    ];
})(window.veganaut.userModule);
