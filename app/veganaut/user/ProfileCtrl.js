(function(module) {
    'use strict';

    module.controller('ProfileCtrl', ['$scope', 'playerService',
        function($scope, playerService) {
            // Get the force-reloaded player data
            playerService.getDeferredMe(true).then(function(me) {
                $scope.me = me;
            });
        }])
    ;
})(window.veganaut.userModule);
