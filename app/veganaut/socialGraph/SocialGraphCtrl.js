(function(controllersModule) {
    'use strict';

    controllersModule.controller('SocialGraphCtrl', ['$scope', '$location', 'activityLinkTargetService', 'backendService',
        function($scope, $location, activityLinkTargetService, backendService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            $scope.createActivityOnNode = function(node) {
                activityLinkTargetService.set(node);
                $location.path('activity');
            };

            $scope.$onRootScope('monkey.socialGraph.nodeAction', function(event, node) {
                if (node) {
                    activityLinkTargetService.set(node);
                    $location.path('activity');
                }
            });
        }]
    );
})(window.monkeyFace.controllersModule);
