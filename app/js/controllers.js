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

    monkeyFaceControllers.controller('LoginCtrl', ['$scope', 'backend', function($scope, backend) {
        $scope.submit = function() {
            if ($scope.form.email && $scope.form.password) {
                backend.login($scope.form.email, $scope.form.password)
                    .success(function (data) {
                        if (data.sessionId) {
                            $scope.login();
                        }
                    })
                    // TODO: handle error
                    .error(function (data) {
                        console.log('Error: ', data);
                    })
                ;
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
                $scope.goToView('socialGraph');
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
