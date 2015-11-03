(function(module) {
    'use strict';

    /**
     * Form Validation Icon Directive adds an icon marking the validation
     * state of an input field. There are three states:
     * valid, pristine and invalid.
     * Uses Bootstrap "input-group-addon" class.
     * @returns {directive}
     *
     * @example
     * // Minimal example to get a validation icon with Bootstrap form styles
     * <form novalidate name="formName">
     *   <div class="form-group">
     *     <div class="input-group">
     *       <input type="text" required name="username" class="form-control" ng-model="form.username" />
     *       <vg-form-validation-icon vg-form-field="formName.username"></vg-form-validation-icon>
     *     </div>
     *   </div>
     * </form>
     */
    var formValidationIconDirective = function() {
        return {
            restrict: 'E',
            require: '^form',
            replace: true,
            scope: {
                field: '=vgFormField'
            },
            controller: ['formValidationService', function(formValidationService) {
                var vm = this;

                /**
                 * Wrapper to get the validation state from the helper service
                 * @returns {string|undefined}
                 */
                vm.getState = function() {
                    return formValidationService.getValidationState(vm.field);
                };
            }],
            controllerAs: 'formValidationIconVm',
            bindToController: true,
            template: '<div class="input-group-addon" ng-switch="formValidationIconVm.getState()">' +
            '<span class="glyphicon glyphicon-ok" ng-switch-when="valid"></span>' +
            '<span class="glyphicon glyphicon-arrow-left" ng-switch-when="pristine"></span>' +
            '<span class="glyphicon glyphicon-remove" ng-switch-when="invalid"></span>' +
            '</div>'
        };
    };

    // Expose as directive
    module.directive('vgFormValidationIcon', [formValidationIconDirective]);
})(window.veganaut.mainModule);
