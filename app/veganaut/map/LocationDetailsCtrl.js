(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl',
        ['$scope', '$routeParams', 'mapDefaults', 'locationService', 'backendService', 'playerService', 'alertService', 'translateService',
        function($scope, $routeParams, mapDefaults, locationService, backendService, playerService, alertService, t) {
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
                        // Prepare success message
                        var pointTexts = [];
                        for (var team in savedMission.points) {
                            if (savedMission.points.hasOwnProperty(team)) {
                                pointTexts.push(savedMission.points[team] + ' (' + team + ')');
                            }
                        }
                        // TODO: should we only show this once we reloaded the location?
                        alertService.addAlert(
                            t('message.mission.success') + pointTexts.join(', '),
                            'success'
                        );

                        // Request the location again
                        locationService.getLocation(locationId).then(function(newLocationData) {
                            $scope.location.update(newLocationData);
                        });
                    })
                    .error(function(data) {
                        alertService.addAlert('Failed to submit your mission: ' + data.error, 'danger');
                    })
                ;
            };

            // Get the location
            locationService.getLocation(locationId).then(function(location) {
                // TODO: handle location not found
                $scope.location = location;
                $scope.center.lat = $scope.location.lat;
                $scope.center.lng = $scope.location.lng;

                playerService.getMe().then(function(me) {
                    $scope.visit = $scope.location.getVisit(me);
                });
            });
        }
    ]);
})(window.veganaut.mapModule);
