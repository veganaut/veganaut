(function() {
    'use strict';

    angular
        .module('veganaut.app.map')
        .component('vgMapCard', mapCardComponent());

    function mapCardComponent() {
        var component = {
            bindings: {
                location: '<vgLocation'
            },
            controller: MapCardComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/map/mapCardComponent.html'
        };

        return component;
    }

    MapCardComponentController.$inject = [
        '$timeout',
        'mapDefaults',
        'leafletData'
    ];

    function MapCardComponentController($timeout, mapDefaults, leafletData) {
        var vm = this;

        vm.mapDefaults = mapDefaults;
        vm.center = {
            lat: 0,
            lng: 0,
            zoom: 16
        };

        vm.$onInit = function() {
            // Maybe this has to go to $onChanges
            leafletData.getMap().then(function(map) {
                var rawMap = angular.copy(map);
                // Doesn't work yet
                rawMap.options.zoomControl = false;
                vm.map = rawMap;
            });

            // Show the map in the next cycle. This needs to be done
            // because leaflet somehow doesn't like to be initialised
            // while the page is still hidden.
            $timeout(function() {
                vm.showMap = true;
            }, 0);
        };

        vm.$onChanges = function(changes) {
            if(changes.location && changes.location.currentValue) {
                vm.center.lat = vm.location.lat;
                vm.center.lng = vm.location.lng;
            }
        };
    }
})();