(function(module) {
    'use strict';

    /**
     * The visitService makes Visits available
     */
    module.factory('visitService', ['Visit', 'backendService', 'alertService',
        function(Visit, backendService, alertSerice) {

            var getVisit = function(location) {
                return new Visit(location);
            };

            var submitVisit = function(visit) {
                var missionData = [];
                for (var i = 0; i < visit.missions.length; i++) {
                    var mission = visit.missions[i];
                    if (mission.completed) {
                        missionData.push(mission.toJson());
                    }
                }
                visit.completed = true;

                // TODO: translate and handle error properly
                backendService.submitVisit(visit.location, missionData)
                    .success(function() {
                        alertSerice.addAlert('Successfully submitted your visit.', 'success');
                    })
                    .error(function(data) {
                        alertSerice.addAlert('Failed to submit your visit: ' + data.error, 'danger');
                    })
                ;
            };

            return {
                getVisit: getVisit,
                submitVisit: submitVisit
            };
        }
    ]);
})(window.veganaut.mapModule);
