(function(module) {
    'use strict';

    /**
     * Controller for the community page. Retrieves scores from the backend
     * and displays them.
     *
     * @param $scope
     * @param $q
     * @param backendService
     * @param playerService
     * @constructor
     */
    var CommunityCtrl = function($scope, $q, backendService, playerService) {
        var that = this;
        if (!backendService.isLoggedIn()) {
            // TODO: this should be handled where the route is defined
            $scope.goToView('login');
        }

        // Get the scores and the player
        $q.all({
            scores: backendService.getScore(),
            player:playerService.getDeferredMe()
        })
            .then(function(resolved) {
                var player = resolved.player;
                var scores = resolved.scores.data;

                // Expose the total people count
                that.totalPeople = scores.people.count;

                // Expose the location statistics
                that.totalLocations = that._sumScores(scores.locationTypes.locations, 'locations');
                that.locationTypes = scores.locationTypes.locations;

                // Calculate the location owner ranking
                that.locationOwnerRanks = that._preparePeopleRanks(
                    scores.people.locations,
                    'locations',
                    player
                );

                // Calculate the mission ranking
                that.missionRanks = that._preparePeopleRanks(
                    scores.people.missions,
                    'missions',
                    player
                );
            })
        ;
    };

    /**
     * Sum the given array of score objects with the given score name
     * @param {Array} scoreArray
     * @param {String} scoreName
     * @returns {number}
     */
    CommunityCtrl.prototype._sumScores = function(scoreArray, scoreName) {
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
     * @private
     */
    CommunityCtrl.prototype._preparePeopleRanks = function(scoreArray, scoreName, player) {
        // TODO: the backend should already send it like this
        var ranks = [];
        var lastScoreValue = Infinity;
        var currentRank;
        _.each(scoreArray, function(score) {
            if (score[scoreName] < lastScoreValue) {
                lastScoreValue = score[scoreName];
                currentRank = {
                    rank: ranks.length + 1,
                    score: lastScoreValue,
                    player: false,
                    items: [],
                    showAll: false
                };
                ranks.push(currentRank);
            }

            // Check if this is the rank of the player
            if (score.person.id === player.id) {
                currentRank.player = player;
            }
            else {
                // Only add the person if it's not the player
                currentRank.items.push(score.person);
            }
        });

        return ranks;
    };

    module.controller('CommunityCtrl', [
        '$scope', '$q', 'backendService', 'playerService',
        CommunityCtrl
    ]);
})(window.veganaut.communityModule);
