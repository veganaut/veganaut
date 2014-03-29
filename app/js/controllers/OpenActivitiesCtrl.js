(function(controllersModule) {
    'use strict';

    controllersModule.controller('OpenActivitiesCtrl', ['$scope', 'backend',
        function($scope, backend) {
            if (!backend.canViewGraph()) {
                $scope.goToView('login');
            }

            // Get the list of open activity links (unused reference codes)
            $scope.openActivityLinks = [];

            backend.getOpenActivityLinks()
                .success(function(data) {
                    $scope.openActivityLinks = data;
                })
            ;
        }]
    );
})(window.monkeyFace.controllersModule);
