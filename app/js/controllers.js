(function() {
    'use strict';

    /* Controllers */
    var monkeyFaceControllers = angular.module('monkeyFace.controllers', []);

    monkeyFaceControllers.controller('AppCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.goToView = function(view) {
            $location.path(view);
        };
    }]);

    monkeyFaceControllers.controller('RegisterCtrl', ['$scope', function($scope) {
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
