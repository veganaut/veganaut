(function(module) {
    'use strict';

    /**
     * The visitService makes Visits available
     */
    module.factory('visitService', ['Visit', 'backendService', 'alertService',
        function(Visit, backendService, alertService) {

            var getVisit = function(location, player) {
                return new Visit(location, player);
            };

            var submitVisit = function(visit) {
                var missionData = [];
                if (typeof visit.visitBonusMission !== 'undefined' && visit.visitBonusMission.completed) {
                    missionData.push(visit.visitBonusMission.toJson());
                }

                for (var i = 0; i < visit.missions.length; i++) {
                    var mission = visit.missions[i];
                    if (mission.completed) {
                        missionData.push(mission.toJson());
                    }
                }

                // TODO: translate and handle error properly
                backendService.submitVisit(visit.location, missionData)
                    .success(function(savedVisit) {
                        var points = savedVisit.totalPoints;
                        var pointTexts = [];
                        for (var team in points) {
                            if (points.hasOwnProperty(team)) {
                                pointTexts.push(points[team] + ' (' + team + ')');
                            }
                        }
                        alertService.addAlert(
                            'Successfully submitted your visit. You made the following points: ' + pointTexts.join(', '),
                            'success'
                        );
                    })
                    .error(function(data) {
                        alertService.addAlert('Failed to submit your visit: ' + data.error, 'danger');
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
