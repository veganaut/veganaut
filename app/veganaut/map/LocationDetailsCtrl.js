(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl', [
        '$scope', '$routeParams', '$timeout', '$translate', 'leafletData', 'mapDefaults',
        'angularPiwik', 'locationService', 'backendService', 'playerService', 'alertService',
        function($scope, $routeParams, $timeout, $translate, leafletData, mapDefaults,
            angularPiwik, locationService, backendService, playerService, alertService)
        {
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

            /**
             * List of people that have recently been active at this location
             * @type {Array}
             */
            $scope.recentlyActiveVeganauts = [];

            /**
             * Whether the current user is already on the recently active list
             * @type {boolean}
             */
            var currentUserIsRecentlyActive = false;

            /**
             * Finishes the given mission and submits it to the backend
             * @param mission
             */
            $scope.finishMission = function(mission) {
                // Finish the mission and get the data
                mission.finish();
                var missionData = mission.toJson();

                // Track the finish of the mission
                angularPiwik.track('location.mission', 'finish', mission.type);

                // TODO: handle error properly
                backendService.submitMission(missionData, $scope.location)
                    .success(function(savedMission) {
                        // Prepare success message
                        var pointTexts = [];
                        for (var team in savedMission.points) {
                            if (savedMission.points.hasOwnProperty(team)) {
                                // TODO: translate team
                                pointTexts.push(savedMission.points[team] + ' (' + team + ')');
                            }
                        }
                        // TODO: should we only show this once we reloaded the location?
                        alertService.addAlert(
                            $translate.instant('message.mission.success') + pointTexts.join(', '),
                            'success'
                        );

                        // Request the location again
                        locationService.getLocation(locationId).then(function(newLocationData) {
                            $scope.location.update(newLocationData);
                        });

                        // Make sure the user is in the list of active Veganauts
                        if (!currentUserIsRecentlyActive) {
                            playerService.getMe().then(function(me) {
                                // Check if the user is already in the list
                                for (var i = 0; i < $scope.recentlyActiveVeganauts.length; i++) {
                                    if (me.id === $scope.recentlyActiveVeganauts[i].id) {
                                        currentUserIsRecentlyActive = true;
                                        break;
                                    }
                                }

                                // If the user is not in the list, add him/her
                                if (!currentUserIsRecentlyActive) {
                                    $scope.recentlyActiveVeganauts.unshift(me);
                                    currentUserIsRecentlyActive = true;
                                }
                            });
                        }
                    })
                    .error(function(data) {
                        alertService.addAlert($translate.instant('message.mission.error') + data.error, 'danger');
                    })
                ;
            };

            /**
             * Start or abort the given mission
             * @param mission
             */
            $scope.toggleMissionStarted = function(mission) {
                var isStartedBefore = mission.started;
                mission.toggleStarted();

                // Track if the mission started status changed
                if (mission.started !== isStartedBefore) {
                    angularPiwik.track(
                        'location.mission',
                        mission.started ? 'start' : 'abort',
                        mission.type
                    );
                }
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

                // Add the marker to the map
                leafletData.getMap().then(function(map) {
                    location.marker.addTo(map);
                });

                // Show the map in the next cycle. This needs to be done
                // because leaflet somehow doesn't like to be initialised
                // while the page is still hidden.
                $timeout(function() {
                    $scope.showMap = true;
                }, 0);
            });

            // If we are logged in, retrieve the recent missions
            if (backendService.isLoggedIn()) {
                backendService.getLocationMissionList(locationId).then(function(response) {
                    // We only want a list of the people, no details
                    var addedVeganauts = {};
                    angular.forEach(response.data, function(mission) {
                        if (addedVeganauts[mission.person.id] !== true) {
                            $scope.recentlyActiveVeganauts.push(mission.person);
                            addedVeganauts[mission.person.id] = true;
                        }
                    });
                });
            }
        }
    ]);
})(window.veganaut.mapModule);
