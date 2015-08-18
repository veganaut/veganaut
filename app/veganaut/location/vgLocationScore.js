(function(module) {
    'use strict';

    /**
     * Shows the score at a given location.
     * The score of the owner and the user are shown as a
     * little bar diagram.
     *
     * @example
     * // Shows the location score for the given logged in user.
     * <vg-location-score vg-location="location" vg-user="user">
     * </vg-location-score>
     *
     * @returns {directive}
     */
    var locationScoreDirective = function() {
        return {
            restrict: 'E',
            scope: {
                location: '=vgLocation',
                user: '=vgUser'
            },
            controller: [function() {
                /**
                 * Returns whether the user is the owner of this location
                 * @returns {boolean}
                 */
                this.userIsOwner = function() {
                    return (this.location.owner.id === this.user.id);
                };

                /**
                 * Returns the number of points to show on the left side
                 * @returns {number}
                 */
                this.getLeftPoints = function() {
                    // If the user is the owner, return the points of the runner-up.
                    if (this.userIsOwner()) {
                        // Check if there is a runner-up
                        var sortedPoints = this.location.getSortedPoints();
                        if (sortedPoints.length > 1) {
                            return sortedPoints[1].points;
                        }

                        // No runner up, return 0
                        return 0;
                    }
                    else {
                        // User is not the owner, return the user's points (or 0 if no points)
                        return this.location.points[this.user.id] || 0;
                    }
                };

                /**
                 * Returns the number of points to show on the right side
                 * (the owner's points).
                 * @returns {number}
                 */
                this.getRightPoints = function() {
                    return this.location.getOwnerPoints();
                };

                /**
                 * Returns the name of the owner
                 * @returns {string}
                 */
                this.getOwnerName = function() {
                    return this.location.owner.nickname;
                };

                /**
                 * Returns the style (width) to use for the left side
                 * @returns {{width: string}}
                 */
                this.getLeftStyle = function() {
                    var leftPoints = this.getLeftPoints();
                    var rightPoints = this.getRightPoints();
                    var totalPoints = leftPoints + rightPoints;
                    var ratio = (totalPoints > 0) ? (leftPoints / totalPoints) : 0.5;
                    return {
                        width: (100 * ratio).toFixed(2) + '%'
                    };
                };
            }],
            controllerAs: 'locationScoreCtrl',
            bindToController: true,
            templateUrl: '/veganaut/location/vgLocationScore.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgLocationScore', [locationScoreDirective]);
})(window.veganaut.locationModule);
