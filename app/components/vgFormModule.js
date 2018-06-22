(function() {
    'use strict';

    /**
     *
     *
     * @type {module}
     */
    var formModule = angular.module('veganaut.form', []);

    /**
     * Directive for rendering a list of text input fields
     * that auto-expands to always have at least one empty
     * input field
     * @returns {directive}
     *
     * @example
     * // Renders a list of <input> of which the first 2 have the required
     * // attribute set, and "Enter Options" is used as placeholder
     * <vg-list-input vg-list="answers" vg-num-required="2"
     *  vg-placeholder="Enter Options"></vg-list-input>
     */
    var listInputDirective = function() {
        return {
            restrict: 'E',
            scope: {
                list: '=vgList',
                numRequired: '@vgNumRequired',
                placeholder: '@vgPlaceholder'
            },
            controller: ['$scope', function($scope) {
                var vm = this;
                vm.numRequired = parseInt(vm.numRequired, 10);

                vm.inputFields = [];
                var addInputField = function(text) {
                    vm.inputFields.push({
                        text: text || ''
                    });
                };

                // Make sure we got a list
                if (!angular.isArray(vm.list)) {
                    vm.list = [];
                }

                for (var i = 0; i < vm.list.length; i += 1) {
                    addInputField(vm.list[i]);
                }
                if (vm.inputFields.length < 1) {
                    addInputField();
                }

                // Watch the list to add or remove new input fields
                $scope.$watch('listInputVm.inputFields', function(inputFields) {
                    // Check if the last item is not empty
                    var lastInput = inputFields[inputFields.length - 1];
                    if (typeof lastInput.text !== 'undefined' && lastInput.text.length > 0) {
                        // Add a new item
                        addInputField();
                    }
                    else if (inputFields.length > 1) {
                        // If the last item is not empty, check if the second last is not also empty
                        var secondLastInput = inputFields[inputFields.length - 2];
                        if (typeof secondLastInput.text === 'undefined' || secondLastInput.text.length === 0) {
                            // Two empty items, remove one
                            inputFields.pop();
                        }
                    }

                    // Clean the list for outside this directive
                    vm.list = [];
                    for (var i = 0; i < inputFields.length; i += 1) {
                        var item = inputFields[i];
                        if (typeof item.text !== 'undefined' && item.text.length > 0) {
                            vm.list.push(item.text);
                        }
                    }
                }, true);
            }],
            controllerAs: 'listInputVm',
            bindToController: true,
            template: '<div ng-repeat="elem in listInputVm.inputFields">' +
                '<input type="text" ng-required="$index < listInputVm.numRequired" class="vg-form__input" ' +
                'ng-model="elem.text" placeholder="{{ listInputVm.placeholder }}"/> ' +
                '</div>'
        };
    };

    // Expose as directive
    formModule.directive('vgListInput', [listInputDirective]);
})();
