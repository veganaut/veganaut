(function(controllersModule) {
    'use strict';

    controllersModule.controller('SocialGraphCtrl', ['$scope', '$location', 'activityLinkTargetProvider', 'backend',
        function($scope, $location, activityLinkTargetProvider, backend) {
            if (!backend.canViewGraph()) {
                $scope.goToView('login');
            }

            $scope.$onRootScope('monkey.socialGraph.nodeAction', function(event, node) {
                if (node) {
                    activityLinkTargetProvider.set(node);
                    $location.path('activity');
                }
            });
        }]
    );
})(window.monkeyFace.controllersModule);
