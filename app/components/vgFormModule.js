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
     * that can auto-expand to always have at least one empty
     * input field
     * @returns {directive}
     *
     * @example
     * // Renders a list of <input> of which the first 2 have the required
     * // attribute set, and "Enter Options" is used as placeholder
     * <vg-list-input list="answers" auto-expand="true"
     *  num-required="2" placeholder="Enter Options"></vg-list-input>
     */
    var listInputDirective = function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                list: '=',
                autoExpand: '=',
                numRequired: '@',
                placeholder: '@'
            },
            controller: function($scope) {
                $scope.numRequired = parseInt($scope.numRequired);

                // Watch the list to add or remove new input fields
                $scope.$watch('list', function(list) {
                    // Only change when auto expand is enabled
                    if (!$scope.autoExpand) {
                        return;
                    }

                    // Check if the last item is not empty
                    var lastItem = list[list.length - 1];
                    if (typeof lastItem.text !== 'undefined' && lastItem.text.length > 0) {
                        // Add a new item
                        list.push({
                            text: ''
                        });
                    }
                    else if (list.length > 1) {
                        // If the last item is not empty, check if the second last is not also empty
                        var secondLastItem = list[list.length - 2];
                        if (typeof secondLastItem.text === 'undefined' || secondLastItem.text.length === 0) {
                            // Two empty items, remove one
                            list.pop();
                        }
                    }
                }, true);
            },
            template: '<div class="form-group" ng-repeat="elem in list">' +
                '<input type="text" ng-required="$index < numRequired" class="form-control" ' +
                'ng-model="elem.text" placeholder="{{ placeholder }}"/> ' +
                '</div>'
        };
    };

    // Expose as directive
    formModule.directive('vgListInput', [listInputDirective]);
})();
