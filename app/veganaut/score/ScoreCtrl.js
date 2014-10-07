(function(module) {
    'use strict';

    /**
     * Controller for the scores page. Retrieves scores from the backend
     * and displays them.
     */
    module.controller('ScoreCtrl', ['$scope', 'backendService',
        function($scope, backendService) {
            /**
             * The logged in user
             * @type {Person}
             */
            $scope.me = undefined;

            /**
             * Scores retrieved from the backend
             * @type {{}}
             */
            $scope.scores = undefined;

            /**
             * Whether to only show people from the team of the user
             * @type {boolean}
             */
            $scope.onlyMyTeam = false;

            /**
             * Filters people scores by team. If enabled, only shows the
             * people from the current user's team
             * @param {{}} score
             * @returns {boolean}
             */
            $scope.filterPeopleByTeam = function(score) {
                // Check if we should filter by the user's team
                // Can only do that once we retrieved 'me'
                if ($scope.onlyMyTeam && angular.isObject($scope.me)) {
                    return (score.person.team === $scope.me.team);
                }
                return true;
            };

            // Get the scores
            backendService.getScore()
                .success(function(scores) {
                    $scope.scores = scores;
                })
            ;

            // Get the logged in user
            backendService.getMe()
                .success(function(me) {
                    $scope.me = me;
                })
            ;
        }
    ]);
})(window.veganaut.scoreModule);
