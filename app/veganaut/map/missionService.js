(function(module) {
    'use strict';

    /**
     * The missionService makes MissionSets available
     */
    module.factory('missionService', ['MissionSet',
        function(MissionSet) {

            var getMissionSet = function() {
                return new MissionSet();
            };

            return {
                getMissionSet: getMissionSet
            };
        }
    ]);
})(window.veganaut.mapModule);
