(function(controllersModule) {
    'use strict';

    controllersModule.controller('SocialGraphCtrl', ['$scope', '$location', 'backendService',
        function($scope, $location, backendService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            /**
             * Goes to the activity link creation form
             * @param node
             */
            $scope.createActivityOnNode = function(node) {
                var path = 'createActivity';
                if (angular.isObject(node) && $scope.canCreateActivityWith(node) && angular.isString(node.id)) {
                    path += '/' + node.id;
                }
                $location.path(path);
            };

            /**
             * Returns whether the player can create an activity with the given node
             * @param node
             * @returns {boolean}
             */
            $scope.canCreateActivityWith = function(node) {
                // TODO: check that it is indeed an instance of Node
                return (node && !node.isMe() && !node.isFriendOfFriend());
            };
        }]
    );
})(window.monkeyFace.controllersModule);
