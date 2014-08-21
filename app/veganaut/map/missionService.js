(function(module) {
    'use strict';

    /**
     * The missionService makes MissionSets available
     */
    module.factory('missionService', ['MissionSet',
        function(MissionSet) {

            var getMissionSet = function(location) {
                return new MissionSet(location);
            };

            return {
                getMissionSet: getMissionSet
            };
        }
    ]);
})(window.veganaut.mapModule);
