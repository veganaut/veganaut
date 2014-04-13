(function(controllersModule) {
    'use strict';

    // TODO: this should be a directive
    controllersModule.controller('MatchCtrl', ['$scope', 'backend',
        function($scope, backend) {
            $scope.scoreData = {};

            backend.getMatch()
                .success(function(data) {
                    $scope.scoreData = data;
                })
            ;
        }
    ]);
})(window.monkeyFace.controllersModule);
