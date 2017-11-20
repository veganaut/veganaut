(function(module) {
    'use strict';

    /**
     * @deprecated Use LocationDetailsComponent in veganaut/location instead
     * @todo Remove with v1.0.0
     */
    module.controller('LocationDetailsCtrl', [
        '$scope', '$routeParams', '$timeout', '$translate', 'leafletData', 'mapDefaults', 'missions', 'pageTitleService',
        'angularPiwik', 'locationService', 'backendService', 'playerService', 'alertService', 'missionService',
        function($scope, $routeParams, $timeout, $translate, leafletData, mapDefaults, missions, pageTitleService,
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

            /**
             * Reference to the leaflet map object
             * @type {{}}
             */
            $scope.map = undefined;

            // TODO: the missions should be stored directly on the location model
            $scope.locationMissions = [];
            $scope.productMissions = {};
            $scope.location = undefined;
            $scope.error = undefined;

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
             * TODO: this should go in a model
             * @param {Product} product
             * @returns {number}
             */
            $scope.getAvailableProductMissionsPoints = function(product) {
                var points = 0;
                _.each($scope.productMissions[product.id], function(mission) {
                    points += mission.getAvailablePoints();
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

                // Check if unavailable products should be hidden
                if (!$scope.showUnavailable.products) {
                    // Show only available and temporarily unavailable products
                    var products = $scope.location.getProducts();
                    if (products.length > 0) {
                        // If we found products, return them
                        return products;
                    }

                    // We haven't found any available or temporarilyUnavailable products, show all instead
                    $scope.showUnavailable.products = true;
                }

                // Show all products
                return $scope.location.getProducts(true);
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
                        // TODO: should we only show this once we reloaded the location?
                        alertService.addAlert(
                            $translate.instant('message.mission.success', {
                                points: savedMission.points
                            }),
                            'success'
                        );

                        // Update the location
                        // TODO: this shouldn't require going through the backendService
                        backendService.getLocation(locationId)
                            .then(function(res) {
                                $scope.location.update(res.data);
                            })
                        ;

                        if (mission instanceof missions.whatOptions) {
                            // If new products are added, we have to reload the missions
                            // TODO: actually, we should not blindly replace the missions, we should merge in the completed ones
                            missionService.getAvailableMissions($scope.location).then(function(availableMissions) {
                                $scope.locationMissions = availableMissions.locationMissions;
                                $scope.specialMissions = availableMissions.specialMissions;
                                $scope.productMissions = availableMissions.productMissions;
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
            var locationPromise = locationService.getLocation(locationId);
            locationPromise.then(function(location) {
                // TODO: handle location not found
                $scope.location = location;
                $scope.center.lat = $scope.location.lat;
                $scope.center.lng = $scope.location.lng;

                // Add the location name to the page title
                pageTitleService.addCustomTitle($scope.location.name);

                if (backendService.isLoggedIn()) {
                    missionService.getAvailableMissions(location).then(function(availableMissions) {
                        $scope.locationMissions = availableMissions.locationMissions;
                        $scope.specialMissions = availableMissions.specialMissions;
                        $scope.productMissions = availableMissions.productMissions;
                    });
                }

                // Get the map
                leafletData.getMap().then(function(map) {
                    $scope.map = map;
                });

                // Show the map in the next cycle. This needs to be done
                // because leaflet somehow doesn't like to be initialised
                // while the page is still hidden.
                $timeout(function() {
                    $scope.showMap = true;
                }, 0);
            });
            locationPromise.catch(function(res) {
                // TODO: These kind of errors should be handled globally
                if (angular.isObject(res) && angular.isString(res.error)) {
                    $scope.error = res.error;
                }
            });
        }
    ]);
})(window.veganaut.mapModule);
