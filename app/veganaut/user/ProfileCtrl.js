(function(module) {
    'use strict';

    module.controller('ProfileCtrl', ['$scope', 'playerService', 'backendService',
        function($scope, playerService, backendService) {
            if (!backendService.isLoggedIn()) {
                $scope.goToView('/register');
            }

            // Get the force-reloaded player data
            playerService.getDeferredMe(true).then(function(me) {
                $scope.me = me;
            });
        }])
    ;
})(window.veganaut.userModule);
