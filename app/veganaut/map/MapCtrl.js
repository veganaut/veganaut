(function(controllersModule) {
    'use strict';

    /**
     * Where to load the map tiles from
     * @type {string}
     */
    var TILE_LAYER_URL = 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png';

    // TODO: refactor, document and add tests!!
    controllersModule.controller('MapCtrl', ['$scope', 'playerService', 'alertService', 'Location',
        // TODO: this page should only be available when logged in
        function($scope, playerService, alertService, Location) {
            var player;

            /**
             * Whether the user is currently adding a new location
             * @type {boolean}
             */
            $scope.isAddingLocation = false;

            /**
             * The currently active location
             * @type {{}}
             */
            $scope.activeLocation = undefined;

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapSettings = {
                tileLayer: TILE_LAYER_URL
            };

            /**
             * Current center of the map
             * @type {{lat: number, lng: number, zoom: number}}
             */
            $scope.center = {
                lat: 46.949,
                lng: 7.451,
                zoom: 14
            };

            /**
             * All Locations shown on the map
             * @type {Location[]}
             */
            $scope.locations = [
                new Location(46.955, 7.451, 'blue',  'Some place', Location.TYPES.event),
                new Location(46.945, 7.456, 'blue',  'Some other place', Location.TYPES.gastronomy),
                new Location(46.95,  7.459, 'green','Great place', Location.TYPES.private),
                new Location(46.94,  7.44,  'green', 'Soon to be great place', Location.TYPES.retail)
            ];

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
                $scope.newLocation = new Location(undefined, undefined, player.team);
                activateLocation($scope.newLocation);
            };

            /**
             * Aborts adding a new location
             */
            $scope.resetAddNewLocation = function() {
                activateLocation();
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
                $scope.isAddingLocation = false;
                var name = $scope.newLocation.title;
                $scope.newLocation = undefined;
                // TODO: submit to backend
                // TODO: translate
                alertService.addAlert('Added new location "' + name + '"', 'success');
            };

            /**
             * Sets the given location as active deactivates it if it's already active.
             * @param {Location} [location]
             */
            var activateLocation = function(location) {
                // Deactivate current location
                if (typeof $scope.activeLocation !== 'undefined') {
                    $scope.activeLocation.setActive(false);
                }

                if ($scope.activeLocation === location || typeof location === 'undefined') {
                    // If the given location is already active
                    // or the new active location should be undefined, deactivate
                    $scope.activeLocation = undefined;
                }
                else {
                    // Otherwise activate the given location
                    $scope.activeLocation = location;
                    $scope.activeLocation.setActive();
                }
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
                activateLocation($scope.locations[args.markerName]);
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
})(window.monkeyFace.controllersModule);
