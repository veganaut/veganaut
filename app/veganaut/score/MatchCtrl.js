(function(module) {
    'use strict';

    // TODO: this should be a directive
    module.controller('MatchCtrl', ['$scope', 'backendService',
        function($scope, backendService) {
            $scope.scoreData = {};

            backendService.getMatch()
                .success(function(data) {
                    $scope.scoreData = data;
                })
            ;
        }
    ]);
})(window.veganaut.scoreModule);
