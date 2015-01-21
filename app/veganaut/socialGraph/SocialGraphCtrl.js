(function(module) {
    'use strict';

    module.controller('SocialGraphCtrl', ['$scope', '$location', 'backendService',
        function($scope, $location, backendService) {
            if (!backendService.canViewGraph()) {
                $scope.goToView('login');
            }

            /**
             * Currently selected elements on the social graph
             * @type {{node: {}, link: {}}}
             */
            $scope.selected = {
                node: undefined,
                link: undefined
            };

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
})(window.veganaut.socialGraphModule);
