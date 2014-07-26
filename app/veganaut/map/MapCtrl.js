(function(controllersModule) {
    'use strict';

    // TODO: refactor, document and add tests!!
    controllersModule.controller('MapCtrl', ['$scope', 'playerService', 'Location',
        // TODO: this page should only be available when logged in
        function($scope, playerService, Location) {
            var player;

            $scope.isAddingLocation = false;
            $scope.selectedLocation = undefined;

            $scope.mapSettings =  {
                tileLayer: 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png'
            };

            $scope.center = {
                lat: 46.949,
                lng: 7.451,
                zoom: 14
            };

            $scope.locations = [
                new Location(46.949, 7.451, 'blue',  'Some place'),
                new Location(46.945, 7.456, 'blue',  'Some other place'),
                new Location(46.95,  7.459, 'green','Great place'),
                new Location(46.94,  7.44,  'green', 'Soon to be great place')
            ];

            $scope.events = {};
            $scope.$on('leafletDirectiveMap.click', function(event, args) {
                if ($scope.isAddingLocation) {
                    // Add new marker at the chosen location
                    var location = new Location(
                        args.leafletEvent.latlng.lat,
                        args.leafletEvent.latlng.lng,
                        player.team,
                        'New Location'
                    );
                    $scope.locations.push(location);

                    $scope.selectedLocation = location;
                    $scope.isAddingLocation = false;
                }
            });

            $scope.$on('leafletDirectiveMarker.click', function(event, args) {
                // TODO: wrap selection in a helper function and change css class of selected location
                var location = $scope.locations[args.markerName];
                if ($scope.selectedLocation === location) {
                    $scope.selectedLocation = undefined;
                }
                else {
                    $scope.selectedLocation = location;
                }
            });

            // TODO: this page should only be shown once the player is set
            playerService.getMe().then(function(me) {
                player = me;
            });
        }
    ]);
})(window.monkeyFace.controllersModule);
