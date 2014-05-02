(function(controllersModule) {
    'use strict';

    // TODO: this should be a directive
    controllersModule.controller('MatchCtrl', ['$scope', 'backendService',
        function($scope, backendService) {
            $scope.scoreData = {};

            backendService.getMatch()
                .success(function(data) {
                    $scope.scoreData = data;
                })
            ;
        }
    ]);
})(window.monkeyFace.controllersModule);
