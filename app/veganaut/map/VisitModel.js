(function(module) {
    'use strict';

    module.service('Visit', ['missions',
        function(missions) {
            /**
             * A Visit is a group of missions that can be done at
             * a location.
             * @param {Location} location
             * @param {Player} player
             * @constructor
             */
            function Visit(location, player) {
                this.location = location;
                this.player = player;
                this.missions = [];
                this.completed = false;

                var that = this;
                angular.forEach(missions, function(Mission) {
                    that.missions.push(new Mission(that));
                });
            }

            /**
             * TODO
             * @param {Mission} mission
             */
            Visit.prototype.finishedMission = function(/*mission*/) {
                // TODO: what should we do here?
            };

            // TODO: this might get easier now since every mission is submitted separately
            /**
             * Returns the total number of points made in this visit
             * @param {Boolean} [ignoreAvailablePoints=false]
             * @returns {number}
             */
            Visit.prototype.getTotalPoints = function(ignoreAvailablePoints) {
                var points = 0;
                for (var i = 0; i < this.missions.length; i++) {
                    if (this.missions[i].completed) {
                        points += this.missions[i][ignoreAvailablePoints ? 'points' : 'receivedPoints'];
                    }
                }

                return points;
            };

            /**
             * Returns the number of points that is still available at this
             * location.
             * @returns {number}
             */
            Visit.prototype.getAvailablePoints = function() {
                return (this.location.availablePoints);
            };

            return Visit;
        }
    ]);
})(window.veganaut.mapModule);
