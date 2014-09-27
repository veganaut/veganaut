(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl',
        ['$scope', '$routeParams', 'mapDefaults', 'locationService', 'backendService', 'playerService', 'alertService',
        function($scope, $routeParams, mapDefaults, locationService, backendService, playerService, alertService) {
            var locationId = $routeParams.id;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapDefaults = mapDefaults;

            /**
             * Current center of the map
             * @type {{lat: number, lng: number, zoom: number}}
             */
            $scope.center = {
                lat: 0,
                lng: 0,
                zoom: 16
            };

            $scope.visit = undefined;
            $scope.location = undefined;

            $scope.submitMission = function(mission) {
                var missionData = mission.toJson();

                // TODO: translate and handle error properly
                backendService.submitMission(missionData, $scope.location)
                    .success(function(savedMission) {
                        var pointTexts = [];
                        for (var team in savedMission.points) {
                            if (savedMission.points.hasOwnProperty(team)) {
                                pointTexts.push(savedMission.points[team] + ' (' + team + ')');
                            }
                        }
                        alertService.addAlert(
                            'Successfully submitted your mission. You made the following points: ' + pointTexts.join(', '),
                            'success'
                        );
                    })
                    .error(function(data) {
                        alertService.addAlert('Failed to submit your mission: ' + data.error, 'danger');
                    })
                ;
            };

            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        $scope.center.lat = $scope.location.lat;
                        $scope.center.lng = $scope.location.lng;
                        break;
                    }
                }
                // TODO: handle location not found
                playerService.getMe().then(function(me) {
                    $scope.visit = $scope.location.getVisit(me);
                });
            });
        }
    ]);
})(window.veganaut.mapModule);
