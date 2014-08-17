(function(module) {
    'use strict';

    module.controller('OpenActivitiesCtrl', ['$scope', 'backendService',
        function($scope, backendService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            // Get the list of open activity links (unused reference codes)
            $scope.openActivityLinks = [];

            backendService.getOpenActivityLinks()
                .success(function(data) {
                    $scope.openActivityLinks = data;
                })
            ;
        }]
    );
})(window.veganaut.socialGraphModule);
