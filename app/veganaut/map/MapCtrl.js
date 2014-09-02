(function(module) {
    'use strict';

    // TODO: refactor, document and add tests!!
    module.controller('MapCtrl', ['$scope', '$location', 'playerService', 'Location', 'locationService',
        // TODO: this page should only be available when logged in
        function($scope, $location, playerService, Location, locationService) {
            var player;

            /**
             * Whether the user is currently adding a new location
             * @type {boolean}
             */
            $scope.isAddingLocation = false;

            // Expose the location service
            $scope.location = locationService;

            // Expose the map settings
            $scope.mapSettings = locationService.mapSettings;

            /**
             * All Locations shown on the map
             * @type {Location[]}
             */
            $scope.locations = [];

            $scope.locationsLoaded = false;
            locationService.getLocations().then(function(locations) {
                $scope.locations = locations;
                $scope.locationsLoaded = true;
            });

            /**
             * Expose the location types
             * @type {{}}
             */
            $scope.locationTypes = Location.TYPES;

            /**
             * Empty events object (needed to get the leaflet map to broadcast events)
             * @type {{}}
             */
            $scope.events = {};

            /**
             * Starts adding a new location
             */
            $scope.startAddNewLocation = function() {
                $scope.isAddingLocation = true;
                $scope.newLocation = new Location(undefined, player.team);
                locationService.activate($scope.newLocation);
            };

            /**
             * Aborts adding a new location
             */
            $scope.resetAddNewLocation = function() {
                locationService.activate();
                if ($scope.newLocation.isAddedToMap === true) {
                    // Remove from map if it was added
                    $scope.locations = $scope.locations.slice(0, $scope.locations.length - 1);
                }
                $scope.isAddingLocation = false;
                $scope.newLocation = undefined;
            };

            /**
             * Finalises adding a new location
             */
            $scope.addNewLocation = function() {
                locationService.submitLocation($scope.newLocation);
                $scope.isAddingLocation = false;
                $scope.newLocation = undefined;
            };

            /**
             * Goes to the location view
             * @param location
             */
            $scope.visitLocation = function(location) {
                $location.path('map/location/' + location.id);
            };

            /**
             * Handler for clicks on the map
             * @param event
             * @param args
             */
            var mapClickHandler = function(event, args) {
                if ($scope.isAddingLocation) {
                    $scope.newLocation.lat = args.leafletEvent.latlng.lat;
                    $scope.newLocation.lng = args.leafletEvent.latlng.lng;

                    // Push to map if not already there
                    if ($scope.newLocation.isAddedToMap !== true) {
                        $scope.locations.push($scope.newLocation);
                        $scope.newLocation.isAddedToMap = true;
                    }
                }
            };

            /**
             * Handler for clicks on map markers (Locations)
             * @param event
             * @param args
             */
            var locationClickHandler = function(event, args) {
                locationService.activate($scope.locations[args.markerName]);
            };

            // Register event handlers
            $scope.$on('leafletDirectiveMap.click', mapClickHandler);
            $scope.$on('leafletDirectiveMarker.click', locationClickHandler);

            // TODO: this page should only be shown once the player is set
            playerService.getMe().then(function(me) {
                player = me;
            });
        }
    ]);
})(window.veganaut.mapModule);
