(function(module) {
    'use strict';

    // TODO: this controller is getting way too big, split it up
    module.controller('LocationDetailsCtrl', [
        '$scope', '$routeParams', '$timeout', '$translate', 'leafletData', 'mapDefaults', 'missions',
        'angularPiwik', 'locationService', 'backendService', 'playerService', 'alertService', 'missionService',
        function($scope, $routeParams, $timeout, $translate, leafletData, mapDefaults, missions,
            angularPiwik, locationService, backendService, playerService, alertService, missionService) {
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

            // TODO: the missions should be stored directly on the location model
            $scope.locationMissions = [];
            $scope.productMissions = [];
            $scope.location = undefined;

            /**
             * List of people that have recently been active at this location
             * @type {Array}
             */
            $scope.recentlyActiveVeganauts = [];

            /**
             * List of possible answers (and class names for the icon)
             * for the effort value mission.
             * @type {{value: string, class: string}[]}
             */
            $scope.possibleEffortValueAnswers = [
                {value: 'yes', class: 'wi-day-sunny'},
                {value: 'ratherYes', class: 'wi-day-cloudy'},
                {value: 'ratherNo', class: 'wi-cloudy'},
                {value: 'no', class: 'wi-thunderstorm'}
            ];

            /**
             * Whether the current user is already on the recently active list
             * @type {boolean}
             */
            var currentUserIsRecentlyActive = false;

            /**
             * Which product is currently shown
             * @type {{}}
             */
            $scope.openedProductId = undefined;

            /**
             * Shows or hides details of the given product.
             * @param {{}} product
             */
            $scope.toggleProduct = function(product) {
                if ($scope.openedProductId === product.id) {
                    $scope.openedProductId = undefined;
                }
                else {
                    $scope.openedProductId = product.id;
                }
            };

            // TODO: Create proper filter from this?
            $scope.filterOnlyZeroMissions = function(mission) {
                return (mission.points > 0);
            };
            $scope.filterOnlyNonZeroMissions = function(mission) {
                return !$scope.filterOnlyZeroMissions(mission);
            };

            /**
             * Returns the number of points that can be made with missions
             * for the given product.
             * TODO: this should got in a model
             * @param {Product} product
             * @returns {number}
             */
            $scope.getAvailableProductMissionsPoints = function(product) {
                var points = 0;
                _.each($scope.productMissions[product.id], function(mission) {
                    if (!mission.completed) {
                        points += mission.points;
                    }
                });
                return points;
            };

            /**
             * Whether to show also the unavailable products
             * TODO: this is an object because we don't have controller-as so scopes get messed up *fuuu*
             * @type {boolean}
             */
            $scope.showUnavailable = { products: false };

            /**
             * Returns the list of products to display
             * TODO: there should be a directive for showing the products & product missions
             * @returns {Product[]}
             */
            $scope.getShownProducts = function() {
                if (!angular.isObject($scope.location)) {
                    return [];
                }
                else if ($scope.showUnavailable.products) {
                    // Show all products
                    return $scope.location.products;
                }
                else {
                    // Show only available and temporarily unavailable products
                    return $scope.location.getProductsByAvailability(['available', 'temporarilyUnavailable']);
                }
            };

            /**
             * Finishes the given mission and submits it to the backend
             * TODO: actually the mission service should submit missions and then know what has to be updated
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

                        if (mission instanceof missions.whatOptions) {
                            // If new products are added, we have to reload the missions
                            // TODO: actually, we should not blindly replace the missions, we should merge in the completed ones
                            missionService.getAvailableMissions($scope.location).then(function(availableMissions) {
                                $scope.locationMissions = availableMissions.locationMissions;
                                $scope.productMissions = availableMissions.productMissions;
                            });
                        }

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
                // Start or abort the mission
                var isStartedBefore = mission.started;
                if (mission.started) {
                    mission.abort();
                }
                else {
                    mission.start();
                }

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

                if (backendService.isLoggedIn()) {
                    missionService.getAvailableMissions(location).then(function(availableMissions) {
                        $scope.locationMissions = availableMissions.locationMissions;
                        $scope.productMissions = availableMissions.productMissions;
                    });
                }

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

            // If we are logged in, retrieve the recent and available missions
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
