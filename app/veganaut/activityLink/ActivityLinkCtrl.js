(function(controllersModule) {
    'use strict';

    controllersModule.controller('ActivityLinkCtrl', ['$scope', '$routeParams', 'backendService', 'alertService', 'nodeService',
        function($scope, $routeParams, backendService, alertService, nodeService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            var targetId = $routeParams.target;
            $scope.target = undefined;

            $scope.activities = {};

            $scope.form = {};

            $scope.submit = function() {
                // Check if the target is an already existing player
                var target;
                if (typeof $scope.target === 'undefined') {
                    // Dummy target -> read name from the form
                    target = $scope.form.targetName;
                }
                else {
                    // No dummy -> target already exists
                    target = $scope.target;
                }
                backendService
                    .addActivityLink(
                        target,
                        $scope.form.selectedActivity
                    )
                    .success(function(data) {
                        // TODO: translate
                        alertService.addAlert('Activity link created with reference code: ' + data.referenceCode, 'success');
                        $scope.goToView('socialGraph');
                    })
                    .error(function(data) {
                        // TODO: translate
                        alertService.addAlert('Activity link could not be created: ' + data.error, 'danger');
                        $scope.goToView('socialGraph');
                    })
                ;
            };

            // Get the activities
            backendService.getActivities()
                .success(function(data) {
                    // Index the activities by their id
                    $scope.activities = {};
                    for (var i = 0; i < data.length; i++) {
                        $scope.activities[data[i].id] = data[i];
                    }
                })
            ;

            // Get the node if the target is given
            if (typeof targetId !== 'undefined') {
                var nodes = nodeService.getNodes();
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (node.id === targetId) {
                        $scope.target = node;
                        break;
                    }
                }
            }
        }]
    );
})(window.monkeyFace.controllersModule);
