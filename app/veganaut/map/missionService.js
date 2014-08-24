(function(module) {
    'use strict';

    /**
     * The missionService makes Visits available
     */
    module.factory('missionService', ['Visit',
        function(Visit) {

            var getVisit = function(location) {
                return new Visit(location);
            };

            return {
                getVisit: getVisit
            };
        }
    ]);
})(window.veganaut.mapModule);
