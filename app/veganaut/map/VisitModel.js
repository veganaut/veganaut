(function(module) {
    'use strict';

    module.service('Visit', ['missions', 'Location',
        function(missions, Location) {
            /**
             * A Visit is a group of missions that can be done at
             * a location.
             * @param {Location} location
             * @constructor
             */
            function Visit(location) {
                this.location = location;
                this.visitMission = undefined;
                this.missions = [];
                this.completed = false;

                if (location.type !== Location.TYPES.private) {
                    this.visitMission = new missions.VisitMission(this);
                    this._addMission(new missions.OptionsAvailableMission(this));
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
                if (mission.type === 'optionsAvailable') {
                    if (mission.outcome === true) {
                        this._addMission(new missions.WhatOptionsMission(this));
                    }
                    this._addMission(new missions.StaffFeedbackMission(this));
                }
                else if (mission.type === 'whatOptions') {
                    // TODO: temporary hack to add ids to the options. This will be provided by the backend
                    var options = mission.outcome;
                    if (typeof options[0].id === 'undefined') {
                        for (var i = 0; i < options.length; i++) {
                            options[i].id = i + 1;
                        }
                    }
                    this._addMission(new missions.BuyOptionsMission(this, options));
                }
                else if (mission.type === 'buyOptions') {
                    this._addMission(new missions.RateLocationMission(this));
                }

                // Finish the visit mission if it's not already finished
                if (typeof this.visitMission !== 'undefined' && !this.visitMission.completed) {
                    this.visitMission.finish();
                }
            };

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
                if (typeof this.visitMission !== 'undefined' && this.visitMission.completed) {
                    points += this.visitMission.points;
                }
                return points;
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
