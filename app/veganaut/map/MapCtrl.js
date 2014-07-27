(function(controllersModule) {
    'use strict';

    /**
     * Where to load the map tiles from
     * @type {string}
     */
    var TILE_LAYER_URL = 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png';

    // TODO: refactor, document and add tests!!
    controllersModule.controller('MapCtrl', ['$scope', 'playerService', 'Location',
        // TODO: this page should only be available when logged in
        function($scope, playerService, Location) {
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
             * @type {*[]}
             */
            $scope.locations = [
                new Location(46.949, 7.451, 'blue',  'Some place'),
                new Location(46.945, 7.456, 'blue',  'Some other place'),
                new Location(46.95,  7.459, 'green','Great place'),
                new Location(46.94,  7.44,  'green', 'Soon to be great place')
            ];

            /**
             * Empty events object (needed to get the leaflet map to broadcast events)
             * @type {{}}
             */
            $scope.events = {};

            /**
             * Sets the given location as active deactivates it if it's already active.
             * @param {Location} location
             */
            var activateLocation = function(location) {
                // Deactivate current location
                if (typeof $scope.activeLocation !== 'undefined') {
                    $scope.activeLocation.setActive(false);
                }

                if ($scope.activeLocation === location) {
                    // If the given location is already active, deactivate
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
                    // Add new marker at the chosen location
                    var location = new Location(
                        args.leafletEvent.latlng.lat,
                        args.leafletEvent.latlng.lng,
                        player.team,
                        'New Location'
                    );
                    $scope.locations.push(location);

                    activateLocation(location);
                    $scope.isAddingLocation = false;
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
