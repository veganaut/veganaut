(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationEditCoordinates', locationEditCoordinatesComponent());

    function locationEditCoordinatesComponent() {
        return {
            bindings: {
                _location: '<vgLocation',
                _form: '<vgForm',
                inputModel: '=vgInputModel'
            },
            controller: LocationEditCoordinatesComponentController,
            templateUrl: '/veganaut/components/editPane/locationEditCoordinates/locationEditCoordinatesComponent.html'
        };
    }

    LocationEditCoordinatesComponentController.$inject = [
        '$scope', '$timeout', 'leafletData', 'mapDefaults', 'Location'
    ];
    function LocationEditCoordinatesComponentController($scope, $timeout, leafletData, mapDefaults, Location) {
        var $ctrl = this;

        /**
         * Leaflet map settings
         * @type {{}}
         */
        $ctrl.mapDefaults = mapDefaults;

        /**
         * Current center of the map
         * @type {{lat: number, lng: number, zoom: number}}
         */
        $ctrl.center = {
            lat: $ctrl._location.lat,
            lng: $ctrl._location.lng,
            zoom: 18 // Zoom in as much as possible to discourage big change
        };

        /**
         * Reference to the leaflet map object
         * @type {{}}
         */
        $ctrl.map = undefined;

        /**
         * Will resolve to the Leaflet map instance
         */
        var mapPromise;

        /**
         * Sets the given coordinates as the inputModel
         * @param {number} lat
         * @param {number} lng
         */
        $ctrl.setNewLocationCoordinates = function(lat, lng) {
            // Set the coordinates both on the inputModel and the location that is displayed on the map
            $ctrl.inputModel = {
                latitude: lat,
                longitude: lng
            };
            $ctrl.editLocation.setLatLng(lat, lng);

            // Tell the form that something was changed by the user
            $ctrl._form.$setDirty();

            // Zoom in all the way to make sure users place it precisely
            // TODO: duplication with CreateLocationModel
            mapPromise.then(function(map) {
                var maxZoom = map.getMaxZoom();
                var zoomTo = [lat, lng];
                if (map.getZoom() < maxZoom || !map.getBounds().contains(zoomTo)) {
                    map.setView(zoomTo, maxZoom);
                }
            });
        };

        /**
         * Handler for clicks on the map
         * @param event
         * @param args
         */
        var mapClickHandler = function(event, args) {
            $ctrl.setNewLocationCoordinates(
                args.leafletEvent.latlng.lat,
                args.leafletEvent.latlng.lng
            );
        };

        $ctrl.$onInit = function() {
            // Get a reference the the leaflet map object
            mapPromise = leafletData.getMap('editCoordinatesMap');
            leafletData.getMap().then(function(map) {
                $ctrl.map = map;
            });

            // Create a copy of the location to edit
            // TODO: improve this by adding a clone method or so to the Location model
            $ctrl.editLocation = new Location({
                id: $ctrl._location.id + '-edit',
                lat: $ctrl._location.lat,
                lng: $ctrl._location.lng,
                type: $ctrl._location.type,
                quality: $ctrl._location.quality
            });
            $ctrl.editLocation.setEditing(true);

            // Show the map in the next cycle. This needs to be done
            // because leaflet somehow doesn't like to be initialised
            // while the page is still hidden.
            $timeout(function() {
                $ctrl.showMap = true;
            }, 0);

            // Register event handlers
            $scope.$on('leafletDirectiveMap.editCoordinatesMap.click', mapClickHandler);
        };

    }
})();
