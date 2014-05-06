(function(controllersModule) {
    'use strict';

    controllersModule.controller('SocialGraphCtrl', ['$scope', '$location', 'backendService',
        function($scope, $location, backendService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            $scope.createActivityOnNode = function(node) {
                var path = 'createActivity';
                if (node.id) {
                    path += '/' + node.id;
                }
                $location.path(path);
            };
        }]
    );
})(window.monkeyFace.controllersModule);
