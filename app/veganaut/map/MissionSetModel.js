(function(module) {
    'use strict';

    module.service('MissionSet', ['missions',
        function(missions) {
            /**
             * A MissionSet is a group of missions that can be done at
             * a location.
             * @constructor
             */
            function MissionSet() {
                this.missions = [];
                this.missionsById = {};

                this._addMission(new missions.OptionsAvailableMission(this));
                this._addMission(new missions.WhatOptionsMission(this));
                this._addMission(new missions.BuyOptionsMission(this));
                this._addMission(new missions.StaffFeedbackMission(this));
                this._addMission(new missions.RateLocationMission(this));
            }

            MissionSet.prototype._addMission = function(mission) {
                this.missions.push(mission);
                this.missionsById[mission.id] = mission;
            };

            return MissionSet;
        }
    ]);
})(window.veganaut.mapModule);
