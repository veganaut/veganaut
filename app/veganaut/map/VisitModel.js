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
             * Returns the total number of points made in this visit
             * @returns {number}
             */
            Visit.prototype.getTotalPoints = function() {
                var points = 0;
                for (var i = 0; i < this.missions.length; i++) {
                    if (this.missions[i].completed) {
                        points += this.missions[i].points;
                    }
                }

                return points;
            };

            return Visit;
        }
    ]);
})(window.veganaut.mapModule);
