(function() {
    'use strict';

    /**
     * vgRankingTable directive:
     * The table shows the top ranks as well as the ranks around the
     * current player. It offers the possibility to show all other ranks too.
     * @returns {directive}
     */
    var rankingTableDirective = function() {
        return {
            restrict: 'E',
            scope: {
                _allRanks: '=vgRanks',
                title: '@vgTitle',
                trackingCategory: '@vgTrackingCategory'
            },
            controller: 'vgRankingTableCtrl',
            controllerAs: 'rankingTableVm',
            bindToController: true,
            templateUrl: '/veganaut/community/rankingTable.tpl.html'
        };
    };

    var rankingTableCtrl = [
        '$scope', 'angularPiwik',
        function($scope, angularPiwik) {
            var vm = this;

            /**
             * How many more ranks to show after a click on show more
             * @type {number}
             */
            var SHOW_MORE_INCREMENT = 5;

            // Set the initial values of how many entries to show
            var numTop = 3;
            var numBefore = 2;
            var numAfter = 2;

            /**
             * Index (in the array vm._allRanks) of the rank in which the player is.
             */
            var playerRankIndex;

            /**
             * Show more ranks from the top
             */
            vm.showMoreTop = function() {
                angularPiwik.track(vm.trackingCategory, 'showMore.top');
                numTop += SHOW_MORE_INCREMENT;
                prepareView();
            };

            /**
             * Show more ranks above the player
             */
            vm.showMoreBefore = function() {
                angularPiwik.track(vm.trackingCategory, 'showMore.beforePlayer');
                numBefore += SHOW_MORE_INCREMENT;
                prepareView();
            };

            /**
             * Show more ranks below the player
             */
            vm.showMoreAfter = function() {
                angularPiwik.track(vm.trackingCategory, 'showMore.afterPlayer');
                numAfter += SHOW_MORE_INCREMENT;
                prepareView();
            };

            // Watch the ranks for changes
            $scope.$watch('rankingTableVm._allRanks', function() {
                if (angular.isArray(vm._allRanks) && vm._allRanks.length > 0) {
                    playerRankIndex = findPlayerRankIndex();
                    prepareView();
                }
            });

            /**
             * Find the rank in which the current player is located
             * and returns the index of that rank (and not the rank number!)
             * @returns {*}
             */
            var findPlayerRankIndex = function() {
                var playerRankIndex;
                for (var i = 0; i < vm._allRanks.length; i++) {
                    if (vm._allRanks[i].player) {
                        playerRankIndex = i;
                        break;
                    }
                }
                return playerRankIndex;
            };

            /**
             * Prepares the data for the view. Needs to be called after every change
             * in rank or change in which ranks should be shown
             */
            var prepareView = function() {
                // Reset the variables for the view
                /**
                 * Ranks shown from the first one downwards
                 * @type {Array}
                 */
                vm.topRanks = [];

                /**
                 * Ranks shown around the current player
                 * @type {Array}
                 */
                vm.playerRanks = [];

                /**
                 * Whether there are more ranks between the top ranks
                 * and the player ranks.
                 * @type {boolean}
                 */
                vm.showMoreMiddle = false;

                /**
                 * Whether there are more ranks after the player ranks
                 * @type {boolean}
                 */
                vm.showMoreEnd = false;

                // First, fill the top ranks
                var i;
                var first = Math.min(numTop, vm._allRanks.length);
                for (i = 0; i < first; i++) {
                    vm.topRanks.push(vm._allRanks[i]);
                }

                // Check if the player has not been found (this should never happen)
                if (angular.isUndefined(playerRankIndex)) {
                    // If this really happens, we'll just show the top few and be done with
                    return;
                }

                // Calculate the starting index of the player ranks
                // (a few ranks are shown before the actual player rank)
                var start = Math.max(playerRankIndex - numBefore, vm.topRanks.length);

                // Calculate the end of the player ranks (an index one higher than the last one to show)
                var end = Math.min(
                    Math.max(playerRankIndex + numAfter + 1, vm.topRanks.length),
                    vm._allRanks.length
                );

                // Add the player ranks
                for (i = start; i < end; i++) {
                    vm.playerRanks.push(vm._allRanks[i]);
                }

                // Check if there are any ranks to be shown between the top and the player
                if (start > vm.topRanks.length) {
                    vm.showMoreMiddle = true;
                }

                // Check if there are more ranks at the end
                if (end < vm._allRanks.length) {
                    vm.showMoreEnd = true;
                }
            };
        }
    ];

    // Define the directive
    angular.module('veganaut.app.community')
        .controller('vgRankingTableCtrl', rankingTableCtrl)
        .directive('vgRankingTable', rankingTableDirective)
    ;
})();
