(function(module) {
    'use strict';

    module.service('MissionSet', ['missions', 'Location',
        function(missions, Location) {
            /**
             * A MissionSet is a group of missions that can be done at
             * a location.
             * @param {Location} location
             * @constructor
             */
            function MissionSet(location) {
                this.missions = [];
                this.missionsById = {};

                if (location.type !== Location.TYPES.private) {
                    this._addMission(new missions.OptionsAvailableMission(this));
                }
            }

            MissionSet.prototype._addMission = function(mission) {
                this.missions.push(mission);
                this.missionsById[mission.id] = mission;
            };

            /**
             * Lets this MissionSet know that a mission has been finished.
             * New missions might be added because of that
             * @param {Mission} mission
             */
            MissionSet.prototype.finishedMission = function(mission) {
                if (mission.id === 'optionsAvailable') {
                    if (mission.answer.hasVegan) {
                        this._addMission(new missions.WhatOptionsMission(this));
                    }
                    this._addMission(new missions.StaffFeedbackMission(this));
                }
                else if (mission.id === 'whatOptions') {
                    // TODO: temporary hack to add ids to the options. This will be provided by the backend
                    var options = mission.answer;
                    if (typeof options[0].id === 'undefined') {
                        for (var i = 0; i < options.length; i++) {
                            options[i].id = i + 1;
                        }
                    }
                    this._addMission(new missions.BuyOptionsMission(this, options));
                }
                else if (mission.id === 'buyOptions') {
                    this._addMission(new missions.RateLocationMission(this));
                }
            };

            return MissionSet;
        }
    ]);
})(window.veganaut.mapModule);
