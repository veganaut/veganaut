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
     * <vg-list-input list="answers" num-required="2"
     *  placeholder="Enter Options"></vg-list-input>
     */
    var listInputDirective = function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                list: '=',
                numRequired: '@',
                placeholder: '@'
            },
            controller: ['$scope', function($scope) {
                $scope.numRequired = parseInt($scope.numRequired);

                $scope.inputFields = [];
                var addInputField = function(text) {
                    $scope.inputFields.push({
                        text: text || ''
                    });
                };

                // Make sure we got a list
                if (!angular.isArray($scope.list)) {
                    $scope.list = [];
                }

                for (var i = 0; i < $scope.list.length; i += 1) {
                    addInputField($scope.list[i]);
                }
                if ($scope.inputFields.length < 1) {
                    addInputField();
                }

                // Watch the list to add or remove new input fields
                $scope.$watch('inputFields', function(inputFields) {
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
                    $scope.list = [];
                    for (var i = 0; i < inputFields.length; i += 1) {
                        var item = inputFields[i];
                        if (typeof item.text !== 'undefined' && item.text.length > 0) {
                            $scope.list.push(item.text);
                        }
                    }
                }, true);
            }],
            template: '<div class="form-group" ng-repeat="elem in inputFields">' +
                '<input type="text" ng-required="$index < numRequired" class="form-control" ' +
                'ng-model="elem.text" placeholder="{{ placeholder }}"/> ' +
                '</div>'
        };
    };

    // Expose as directive
    formModule.directive('vgListInput', [listInputDirective]);
})();
