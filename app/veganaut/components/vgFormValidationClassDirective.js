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
     * // Minimal example to get the Bootstrap form-group validation classes.
     * <form novalidate name="formName">
     *   <div class="form-group" vg-form-validation-class="formName.username">
     *     <input type="text" required name="username" class="form-control" ng-model="form.username" />
     *   </div>
     * </form>
     */
    var formValidationClassDirective = function(formValidationService) {
        /**
         * Map of validation states to CSS class names to use
         * @type {{valid: string, pristine: string, invalid: string}}
         */
        var CLASS_MAP = {
            valid: 'has-success',
            pristine: 'has-warning',
            invalid: 'has-error'
        };

        return {
            restrict: 'A',
            require: '^form',
            scope: {
                field: '=vgFormValidationClass'
            },

            link: function (scope, el) {
                /**
                 * Last class that was set
                 */
                var lastClass;

                // Watch the field
                scope.$watchCollection('field', function (value) {
                    // Get the new class
                    var newClass = CLASS_MAP[formValidationService.getValidationState(value)];

                    // Set the new class
                    if (lastClass !== newClass) {
                        if (angular.isString(lastClass)) {
                            el.removeClass(lastClass);
                        }
                        if (angular.isString(newClass)) {
                            el.addClass(newClass);
                        }
                    }

                    // Store for the next update
                    lastClass = newClass;
                });
            }
        };
    };

    // Expose as directive
    module.directive('vgFormValidationClass', ['formValidationService', formValidationClassDirective]);
})(window.veganaut.mainModule);
