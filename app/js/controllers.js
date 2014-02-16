(function() {
    'use strict';

    /* Controllers */
    var monkeyFaceControllers = angular.module('monkeyFace.controllers', []);

    monkeyFaceControllers.controller('AppCtrl', ['$scope', '$location', 'backend', 'alertProvider',
        function($scope, $location, backend, alertProvider) {
            $scope.goToView = function(view) {
                $location.path(view);
            };

            // Expose some backend states
            $scope.isLoggedIn = backend.isLoggedIn;
            $scope.canViewGraph = backend.canViewGraph;

            $scope.logout = function() {
                backend.logout()
                    .success(function() {
                        $scope.goToView('login');
                    })
                ;
            };

            // Expose alerts
            $scope.alerts = alertProvider.alerts;
            $scope.closeAlert = alertProvider.removeAlert;

            $scope.submitReferenceCode = function() {
                backend.submitReferenceCode($scope.form.referenceCode)
                    .success(function() {
                        alertProvider.addAlert('Successfully submitted reference code', 'success');

                        // Reset form
                        $scope.form.referenceCode = '';

                        // Show the graph
                        $scope.goToView('socialGraph');
                    })
                    .error(function(data) {
                        alertProvider.addAlert('Could not submit reference code: ' + data.error, 'danger');
                    })
                ;
            };
        }
    ]);

    monkeyFaceControllers.controller('RegisterCtrl', ['$scope', 'backend', 'alertProvider',
        function($scope, backend, alertProvider) {
            $scope.submit = function() {
                // TODO: get the form to already validate that password and password repeat should be the same
                if ($scope.form.password === $scope.form.passwordRepeat) {
                    backend.register($scope.form.email, $scope.form.fullName, $scope.form.password)
                        .success(function(data) {
                            // TODO: now start a session as that user
                            console.log(data);
                        })
                        .error(function(data) {
                            // TODO: showing the error to the user should be done by the backend service
                            alertProvider.addAlert('Could not register: ' + data.error, 'danger');
                        })
                    ;
                }
            };
        }])
    ;

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
            if (!backend.canViewGraph()) {
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

    monkeyFaceControllers.controller('ActivityLinkCtrl', ['$scope', 'activityLinkTargetProvider', 'backend', 'alertProvider',
        function($scope, activityLinkTargetProvider, backend, alertProvider) {
            $scope.activityLinkTarget = activityLinkTargetProvider.get();
            if (!$scope.activityLinkTarget) {
                $scope.goToView('socialGraph');
            }

            $scope.activities = {};

            $scope.formSubmitted = false;

            $scope.form = {};

            $scope.submit = function() {
                // Check if form is valid
                // TODO: improve this and use angular forms
                var formValid = false;
                for (var key in $scope.form) {
                    if ($scope.form.hasOwnProperty(key) && $scope.form[key]) {
                        formValid = true;
                        break;
                    }
                }

                if (formValid) {
                    // Check if the target is an already existing player
                    var target;
                    if ($scope.activityLinkTarget.type === 'dummy') {
                        // Dummy target -> read name from the form
                        target = $scope.form.targetName;
                    }
                    else {
                        // No dummy -> target already exists
                        target = $scope.activityLinkTarget;
                    }
                    backend
                        .addActivityLink(
                            target,
                            $scope.form.location,
                            $scope.form.startTime,
                            $scope.form.selectedActivity
                        )
                        .success(function(data) {
                            // TODO: translate
                            alertProvider.addAlert('Activity link created with reference code: ' + data.referenceCode, 'success');
                            $scope.goToView('socialGraph');
                        })
                        .error(function(data) {
                            // TODO: translate
                            alertProvider.addAlert('Activity link could not be created: ' + data.error.message, 'danger');
                            $scope.goToView('socialGraph');
                        })
                    ;
                    $scope.formSubmitted = true;
                    activityLinkTargetProvider.set();
                }
            };

            // Get the activities
            backend.getActivities()
                .success(function(data) {
                    // Index the activities by their id
                    $scope.activities = {};
                    for (var i = 0; i < data.length; i++) {
                        $scope.activities[data[i].id] = data[i];
                    }
                })
            ;
        }]
    );
})();
