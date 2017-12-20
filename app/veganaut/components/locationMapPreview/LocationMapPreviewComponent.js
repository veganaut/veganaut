(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationMapPreview', locationMapPreviewComponent());

    function locationMapPreviewComponent() {
        var component = {
            require: {
                parent: '^^vgLocationDetails'
            },
            bindings: {
                location: '<vgLocation',
                onClick: '&vgOnClick'
            },
            controller: LocationMapPreviewComponentController,
            controllerAs: 'vm',
            templateUrl: 'veganaut/components/locationMapPreview/locationMapPreviewComponent.html'
        };

        return component;
    }

    LocationMapPreviewComponentController.$inject = [
        '$timeout',
        'mapDefaults',
        'leafletData'
    ];

    function LocationMapPreviewComponentController($timeout, mapDefaults, leafletData) {
        var vm = this;

        var defaults = angular.copy(mapDefaults);
        defaults.zoomControl = false;
        defaults.doubleClickZoom = false;
        defaults.dragging = false;
        defaults.boxZoom = false;
        defaults.attributionControl = false;
        vm.mapDefaults = defaults;

        vm.center = {
            lat: 0,
            lng: 0,
            zoom: 17
        };

        vm.mapClickHandler = mapClickHandler;

        vm.$onInit = function() {
            // Maybe this has to go to $onChanges
            leafletData.getMap().then(function(map) {
                vm.map = map;
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

        function mapClickHandler() {
            vm.onClick();
        }
    }
})();