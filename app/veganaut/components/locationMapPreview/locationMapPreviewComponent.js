(function() {
    'use strict';

    angular
        .module('veganaut.app')
        .component('vgLocationMapPreview', locationMapPreviewComponent());

    function locationMapPreviewComponent() {
        var component = {
            bindings: {
                location: '<vgLocation',
                onClick: '&vgOnClick'
            },
            controller: LocationMapPreviewComponentController,
            templateUrl: 'veganaut/components/locationMapPreview/locationMapPreviewComponent.html'
        };

        return component;
    }

    LocationMapPreviewComponentController.$inject = [
        '$scope', '$timeout', 'mapDefaults', 'leafletData'
    ];

    function LocationMapPreviewComponentController($scope, $timeout, mapDefaults, leafletData) {
        var $ctrl = this;

        var defaults = angular.copy(mapDefaults);
        defaults.zoomControl = false;
        defaults.doubleClickZoom = false;
        defaults.dragging = false;
        defaults.boxZoom = false;
        defaults.attributionControl = false;
        $ctrl.mapDefaults = defaults;

        $ctrl.center = {
            lat: 0,
            lng: 0,
            zoom: 17
        };

        $ctrl.mapClickHandler = mapClickHandler;

        $ctrl.$onInit = function() {
            // Maybe this has to go to $onChanges
            leafletData.getMap().then(function(map) {
                $ctrl.map = map;
            });

            // Show the map in the next cycle. This needs to be done
            // because leaflet somehow doesn't like to be initialised
            // while the page is still hidden.
            $timeout(function() {
                $ctrl.showMap = true;
            }, 0);
        };

        // Watch for changes in the coordinates to update the map center
        // Note that $onChanges somehow doesn't trigger when only a property of $ctrl.location changes
        $scope.$watchGroup(['$ctrl.location.lat', '$ctrl.location.lng'], function() {
            $ctrl.center.lat = $ctrl.location.lat;
            $ctrl.center.lng = $ctrl.location.lng;
        });

        function mapClickHandler() {
            $ctrl.onClick();
        }
    }
})();
