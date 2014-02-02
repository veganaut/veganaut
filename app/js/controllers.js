(function() {
    'use strict';

    /* Controllers */
    var monkeyFaceControllers = angular.module('monkeyFace.controllers', []);

    monkeyFaceControllers.controller('AppCtrl', ['$scope', '$location', 'backend', function($scope, $location, backend) {
        $scope.goToView = function(view) {
            $location.path(view);
        };

        // TODO: should move the login/out functionality to a service
        $scope.isLoggedIn = backend.isLoggedIn;

        $scope.logout = function() {
            backend.logout()
                .success(function() {
                    $scope.goToView('login');
                })
            ;
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
        if (backend.isLoggedIn()) {
            $scope.goToView('socialGraph');
        }

        $scope.submit = function() {
            if ($scope.form && $scope.form.email && $scope.form.password) {
                backend.login($scope.form.email, $scope.form.password)
                    .success(function () {
                        if (backend.isLoggedIn()) {
                            $scope.goToView('socialGraph');
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


    monkeyFaceControllers.controller('SocialGraphCtrl', ['$scope', '$location', 'activityLinkTargetProvider', 'backend',
        function($scope, $location, activityLinkTargetProvider, backend) {
            if (!backend.isLoggedIn()) {
                $scope.goToView('login');
            }
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
