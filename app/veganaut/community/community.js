(function() {
    'use strict';

    /**
     * Component for the community page. Retrieves scores from the backend
     * and displays them.
     * @returns {directive}
     */
    var communityDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgCommunityCtrl',
            controllerAs: 'communityVm',
            bindToController: true,
            templateUrl: '/veganaut/community/community.tpl.html'
        };
    };

    var communityCtrl = [
        '$scope', '$q', 'backendService', 'playerService',
        function($scope, $q, backendService, playerService) {
            var vm = this;

            if (!backendService.isLoggedIn()) {
                // TODO: this should be handled where the route is defined
                $scope.$parent.goToView('login');
            }

            // Get the scores and the player
            $q.all({
                    scores: backendService.getScore(),
                    player: playerService.getDeferredMe()
                })
                .then(function(resolved) {
                    var player = resolved.player;
                    var scores = resolved.scores.data;

                    // Expose the total people count
                    vm.totalPeople = scores.people.count;

                    // Expose the location statistics
                    vm.totalLocations = sumScores(scores.locationTypes.locations, 'locations');
                    vm.locationTypes = scores.locationTypes.locations;

                    // Calculate the mission ranking
                    vm.taskRanks = preparePeopleRanks(
                        scores.people.tasks,
                        'tasks',
                        player
                    );
                })
            ;

            /**
             * Sum the given array of score objects with the given score name
             * @param {Array} scoreArray
             * @param {String} scoreName
             * @returns {number}
             */
            var sumScores = function(scoreArray, scoreName) {
                var sum = 0;

                // Sum them up
                _.each(scoreArray, function(score) {
                    sum += score[scoreName];
                });
                return sum;
            };

            /**
             * Prepares a ranking about people to give to the vgRankingTable directive.
             * @param scoreArray
             * @param scoreName
             * @param player
             * @returns {Array}
             */
            var preparePeopleRanks = function(scoreArray, scoreName, player) {
                // TODO: the backend should already send it like this
                var ranks = [];
                var lastScoreValue = Infinity;
                var currentRank;
                var playerFound = false;
                _.each(scoreArray, function(score) {
                    if (score[scoreName] < lastScoreValue) {
                        lastScoreValue = score[scoreName];
                        currentRank = createEmptyRank(ranks.length + 1, lastScoreValue);
                        ranks.push(currentRank);
                    }

                    // Check if this is the rank of the player
                    if (score.person.id === player.id) {
                        playerFound = true;
                        currentRank.player = player;
                    }
                    else {
                        // Only add the person if it's not the player
                        currentRank.items.push(score.person);
                    }
                });

                // If the player has not been found, we add an extra rank
                // with a score of 0 and place the player inside.
                if (!playerFound) {
                    currentRank = createEmptyRank(ranks.length + 1, 0);
                    currentRank.player = player;
                    ranks.push(currentRank);
                }

                return ranks;
            };

            /**
             * Creates an empty rank entry and returns it.
             * @param {number} rank
             * @param {number} score
             * @returns {{}}
             */
            var createEmptyRank = function(rank, score) {
                return {
                    rank: rank,
                    score: score,
                    player: false,
                    items: [],
                    showAll: false
                };
            };
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.community')
        .controller('vgCommunityCtrl', communityCtrl)
        .directive('vgCommunity', [communityDirective])
    ;
})();
