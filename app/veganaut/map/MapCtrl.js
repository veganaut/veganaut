(function(controllersModule) {
    'use strict';

    // TODO: refactor, document and add tests!!

    /**
     * Defines the available icons for the map markers
     * @type {{}}
     */
    var icons = {
        blue: {
            type: 'div',
            iconSize: null, // Will be set in CSS,
            className: 'blueMarker'
        },
        green: {
            type: 'div',
            iconSize: null,
            className: 'greenMarker'
        }
    };

    var dummyLocations = [
        {
            lat: 46.949,
            lng: 7.451,
            icon: icons.blue,
            title: 'Some place'
        },
        {
            lat: 46.945,
            lng: 7.456,
            icon: icons.blue,
            title: 'Some other place'
        },
        {
            lat: 46.95,
            lng: 7.459,
            icon: icons.green,
            title: 'Great place'
        },
        {
            lat: 46.94,
            lng: 7.44,
            icon: icons.green,
            title: 'Soon to be great place'
        }
    ];

    controllersModule.controller('MapCtrl', ['$scope', 'playerService',
        // TODO: this page should only be available when logged in
        function($scope, playerService) {
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

            $scope.locations = dummyLocations;

            $scope.events = {};
            $scope.$on('leafletDirectiveMap.click', function(event, args) {
                if ($scope.isAddingLocation) {
                    // Add new marker at the chosen location
                    var location = {
                        lat: args.leafletEvent.latlng.lat,
                        lng: args.leafletEvent.latlng.lng,
                        title: 'New Location',
                        icon: icons[player.team]
                    };
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
