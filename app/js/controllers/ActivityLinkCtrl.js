(function(controllersModule) {
    'use strict';

    controllersModule.controller('ActivityLinkCtrl', ['$scope', 'activityLinkTargetProvider', 'backend', 'alertProvider',
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
                            $scope.form.selectedActivity
                        )
                        .success(function(data) {
                            // TODO: translate
                            alertProvider.addAlert('Activity link created with reference code: ' + data.referenceCode, 'success');
                            $scope.goToView('socialGraph');
                        })
                        .error(function(data) {
                            // TODO: translate
                            alertProvider.addAlert('Activity link could not be created: ' + data.error, 'danger');
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
})(window.monkeyFace.controllersModule);
