(function(module) {
    'use strict';

    /**
     * Controller for the vgRankingTable directive.
     * The table shows the top ranks as well as the ranks around the
     * current player. It offers the possibility to show all other ranks too.
     * @param $scope
     * @param angularPiwik
     * @constructor
     */
    var RankingTableCtrl = function($scope, angularPiwik) {
        this._angularPiwik = angularPiwik;

        // Set the initial values of how many entries to show
        this._numTop = 3;
        this._numBefore = 2;
        this._numAfter = 2;

        // Watch the ranks for changes
        var that = this;
        $scope.$watch(
            function() {
                return that._allRanks;
            },
            function() {
                if (angular.isArray(that._allRanks) && that._allRanks.length > 0) {
                    that._playerRankIndex = that._findPlayerRankIndex();
                    that._prepareView();
                }
            }
        );
    };

    /**
     * How many more ranks to show after a click on show more
     * @type {number}
     * @private
     */
    RankingTableCtrl.prototype._SHOW_MORE_INCREMENT = 5;

    /**
     * Find the rank in which the current player is located
     * and returns the index of that rank (and not the rank number!)
     * @returns {*}
     * @private
     */
    RankingTableCtrl.prototype._findPlayerRankIndex = function() {
        var playerRankIndex;
        for (var i = 0; i < this._allRanks.length; i++) {
            if (this._allRanks[i].player) {
                playerRankIndex = i;
                break;
            }
        }
        return playerRankIndex;
    };

    /**
     * Prepares the data for the view. Needs to be called after every change
     * in rank or change in which ranks should be shown
     * @private
     */
    RankingTableCtrl.prototype._prepareView = function() {
        // Reset the variables for the view
        /**
         * Ranks shown from the first one downwards
         * @type {Array}
         */
        this.topRanks = [];

        /**
         * Ranks shown around the current player
         * @type {Array}
         */
        this.playerRanks = [];

        /**
         * Whether there are more ranks between the top ranks
         * and the player ranks.
         * @type {boolean}
         */
        this.showMoreMiddle = false;

        /**
         * Whether there are more ranks after the player ranks
         * @type {boolean}
         */
        this.showMoreEnd = false;

        // First, fill the top ranks
        var i;
        var first = Math.min(this._numTop, this._allRanks.length);
        for (i = 0; i < first; i++) {
            this.topRanks.push(this._allRanks[i]);
        }

        // Check if the player has not been found (this should never happen)
        if (angular.isUndefined(this._playerRankIndex)) {
            // If this really happens, we'll just show the top few and be done with
            return;
        }

        // Calculate the starting index of the player ranks
        // (a few ranks are shown before the actual player rank)
        var start = Math.max(this._playerRankIndex - this._numBefore, this.topRanks.length);

        // Calculate the end of the player ranks (an index one higher than the last one to show)
        var end = Math.min(
            Math.max(this._playerRankIndex + this._numAfter + 1, this.topRanks.length),
            this._allRanks.length
        );

        // Add the player ranks
        for (i = start; i < end; i++) {
            this.playerRanks.push(this._allRanks[i]);
        }

        // Check if there are any ranks to be shown between the top and the player
        if (start > this.topRanks.length) {
            this.showMoreMiddle = true;
        }

        // Check if there are more ranks at the end
        if (end < this._allRanks.length) {
            this.showMoreEnd = true;
        }
    };

    /**
     * Show more ranks from the top
     */
    RankingTableCtrl.prototype.showMoreTop = function() {
        this._angularPiwik.track(this.trackingCategory, 'showMore.top');
        this._numTop += this._SHOW_MORE_INCREMENT;
        this._prepareView();
    };

    /**
     * Show more ranks above the player
     */
    RankingTableCtrl.prototype.showMoreBefore = function() {
        this._angularPiwik.track(this.trackingCategory, 'showMore.beforePlayer');
        this._numBefore += this._SHOW_MORE_INCREMENT;
        this._prepareView();
    };

    /**
     * Show more ranks below the player
     */
    RankingTableCtrl.prototype.showMoreAfter = function() {
        this._angularPiwik.track(this.trackingCategory, 'showMore.afterPlayer');
        this._numAfter += this._SHOW_MORE_INCREMENT;
        this._prepareView();
    };

    // Define the directive
    module.directive('vgRankingTable', function() {
        return {
            restrict: 'E',
            scope: {
                _allRanks: '=vgRanks',
                title: '@vgTitle',
                trackingCategory: '@vgTrackingCategory'
            },
            controller: ['$scope', 'angularPiwik', RankingTableCtrl],
            controllerAs: 'rankingTable',
            bindToController: true,
            templateUrl: '/veganaut/community/vgRankingTable.tpl.html'
        };
    });
})(window.veganaut.communityModule);
