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


    monkeyFaceControllers.controller('SocialGraphCtrl', ['$scope', '$location', 'activityLinkTargetProvider',
        function($scope, $location, activityLinkTargetProvider) {
            $scope.$onRootScope('alien.socialGraph.nodeAction', function(event, node) {
                if (node) {
                    activityLinkTargetProvider.set(node);
                    $location.path('activity');
                }
            });
        }]
    );

    monkeyFaceControllers.controller('ActivityLinkCtrl', ['$scope', 'activityLinkTargetProvider',
        function($scope, activityLinkTargetProvider) {
            $scope.activityLinkTarget = activityLinkTargetProvider.get();
            if (!$scope.activityLinkTarget) {
                $scope.goToView('socialGraph')
            }

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
                        activityLinkTargetProvider.set();
                        break;
                    }
                }
            };
        }]
    );
})();
