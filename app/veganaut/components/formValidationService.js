(function(module) {
    'use strict';
    module.factory('formValidationService', [
        function() {
            /**
             * Form Validation Service offers helpers for form validation.
             * @constructor
             */
            var FormValidationService = function() {
            };

            /**
             * Returns the state of validation.
             * The formField is the object that angular creates for every field in a form.
             * @param {{}} formField
             * @returns {string|undefined} "valid", "pristine" or "invalid".
             *      undefined if no formField given.
             */
            FormValidationService.prototype.getValidationState = function(formField) {
                // Return undefined if field is not set
                if (!angular.isObject(formField)) {
                    return;
                }
                if (formField.$valid) {
                    return 'valid';
                }
                else if (formField.$pristine) {
                    return 'pristine';
                }
                else {
                    return 'invalid';
                }
            };

            return new FormValidationService();
        }
    ]);
})(window.veganaut.mainModule);
