(function() {
    'use strict';

    /* Controllers */
    var monkeyFaceControllers = angular.module('monkeyFace.controllers', []);

    monkeyFaceControllers.controller('SocialGraphCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.$watch('selectedNode', function(selectedNode) {
            if (selectedNode && selectedNode.type === 'dummy') {
                $location.path('activity');
            }
        });
    }]);

    monkeyFaceControllers.controller('ActivityInstanceCtrl', ['$scope', function($scope) {
        $scope.activities = [
            {
                name: 'Bring Cake'
            },
            {
                name: 'Go to a restaurant'
            }
        ];

        $scope.formSubmitted = false;

        $scope.submit = function() {
            for (var key in $scope.form) {
                if ($scope.form.hasOwnProperty(key) && $scope.form[key]) {
                    $scope.formSubmitted = true;
                    break;
                }
            }
        };
    }]);
})();
