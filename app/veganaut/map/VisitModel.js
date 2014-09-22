(function(module) {
    'use strict';

    module.service('Visit', ['missions', 'Location',
        function(missions, Location) {
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
                this.visitBonusMission = undefined;
                this.missions = [];
                this.completed = false;

                if (location.type !== Location.TYPES.private) {
                    var hasOptionMission = new missions.HasOptionsMission(this);
                    if (location.canGetVisitBonus()) {
                        this.visitBonusMission = new missions.VisitBonusMission(this, hasOptionMission);
                    }
                    this._addMission(hasOptionMission);
                    this._addMission(new missions.WantVeganMission(this));
                    this._addMission(new missions.OfferQualityMission(this));
                    this._addMission(new missions.EffortValueMission(this));
                }
            }

            Visit.prototype._addMission = function(mission) {
                this.missions.push(mission);
            };

            /**
             * Lets this Visit know that a mission has been finished.
             * New missions might be added because of that
             * @param {Mission} mission
             */
            Visit.prototype.finishedMission = function(mission) {
                if (mission.type === 'hasOptions') {
                    if (mission.outcome === true) {
                        this._addMission(new missions.WhatOptionsMission(this));
                    }
                    this._addMission(new missions.GiveFeedbackMission(this));
                }
                else if (mission.type === 'whatOptions') {
                    // TODO: temporary hack to add ids to the options. This will be provided by the backend
                    var options = [];
                    for (var i = 0; i < mission.outcome.length; i++) {
                        options.push({
                            id: i + 1,
                            name: mission.outcome[i]
                        });
                    }
                    this._addMission(new missions.BuyOptionsMission(this, options));
                }
                else if (mission.type === 'buyOptions') {
                    this._addMission(new missions.RateOptionsMission(this));
                }

                // Finish the visitBonus mission if it's not already finished
                if (typeof this.visitBonusMission !== 'undefined' && !this.visitBonusMission.completed) {
                    this.visitBonusMission.outcome = true;
                    this.visitBonusMission.finish();
                }
            };

            /**
             * Returns the total number of points made in this visit
             * @param {Boolean} [ignoreAvailablePoints=false]
             * @returns {number}
             */
            Visit.prototype.getTotalPoints = function(ignoreAvailablePoints) {
                // TODO: I'm tired and this is getting ugly. refactor.
                var points = 0;
                for (var i = 0; i < this.missions.length; i++) {
                    if (this.missions[i].completed) {
                        points += this.missions[i][ignoreAvailablePoints ? 'points' : 'receivedPoints'];
                    }
                }
                if (typeof this.visitBonusMission !== 'undefined' && this.visitBonusMission.completed) {
                    points += this.visitBonusMission[ignoreAvailablePoints ? 'points' : 'receivedPoints'];
                }

                return points;
            };

            /**
             * Returns the number of points that is still available at this
             * location taking into account the already completed missions.
             * @returns {number}
             */
            Visit.prototype.getRemainingAvailablePoints = function() {
                return (this.location.availablePoints - this.getTotalPoints());
            };

            /**
             * Returns a reason why this visit can not be submitted at the moment.
             * If the visit can be submitted, undefined is returned.
             * The reason has to be translated by the translation system before
             * displaying it.
             *
             * @returns {string|undefined}
             */
            Visit.prototype.cannotSubmitReason = function() {
                if (this.getTotalPoints() === 0) {
                    return 'map.mission.visitForm.validation.noMission';
                }
                for (var i = 0; i < this.missions.length; i++) {
                    if (this.missions[i].started && !this.missions[i].completed) {
                        return 'map.mission.visitForm.validation.openMission';
                    }
                }
                return undefined;
            };

            return Visit;
        }
    ]);
})(window.veganaut.mapModule);
