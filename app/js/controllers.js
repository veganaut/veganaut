(function() {
    'use strict';

    /* Controllers */
    var monkeyFaceControllers = angular.module('monkeyFace.controllers', []);

    monkeyFaceControllers.controller('AppCtrl', ['$scope', '$location', function($scope, $location) {
        $scope.goToView = function(view) {
            $location.path(view);
        };

        // TODO: should move the login/out functionality to a service
        $scope.loggedIn = false;

        $scope.login = function() {
            $scope.loggedIn = true;
            $scope.goToView('socialGraph');
        };

        $scope.logout = function() {
            $scope.loggedIn = false;
            $scope.goToView('socialGraph');
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

    monkeyFaceControllers.controller('LoginCtrl', ['$scope', function($scope) {
        $scope.submit = function() {
            for (var key in $scope.form) {
                if ($scope.form.hasOwnProperty(key) && $scope.form[key]) {
                    $scope.login();
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
