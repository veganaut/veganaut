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
                this.missions = [];

                if (location.type !== Location.TYPES.private) {
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
                    if (mission.outcome.hasVegan) {
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
            };

            return Visit;
        }
    ]);
})(window.veganaut.mapModule);
