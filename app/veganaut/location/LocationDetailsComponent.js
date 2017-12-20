(function() {
    'use strict';

    angular
        .module('veganaut.app.location')
        .component('vgLocationDetails', locationDetailsComponent());

    function locationDetailsComponent() {
        var component = {
            bindings: {
                // The location to show the title and icons for
                location: '<vgLocation'
            },
            controller: LocationDetailsComponentController,
            controllerAs: 'vm',
            templateUrl: '/veganaut/location/locationDetailsComponent.html'
        };

        return component;
    }

    LocationDetailsComponentController.$inject = [
        '$routeParams',
        '$timeout',
        '$translate',
        'leafletData',
        'missions',
        'pageTitleService',
        'angularPiwik',
        'locationService',
        'backendService',
        'playerService',
        'alertService',
        'missionService'
    ];

    function LocationDetailsComponentController($routeParams, $timeout, $translate, leafletData, missions, pageTitleService,
        angularPiwik, locationService, backendService, playerService, alertService, missionService)
    {
        var vm = this;

        // TODO: the missions should be stored directly on the location model
        vm.locationMissions = [];
        vm.productMissions = {};
        vm.specialMissions = [];
        vm.error = undefined;

        vm.edit = false;

        /**
         * Whether to show also the unavailable products
         * TODO: this is an object because we don't have controller-as so scopes get messed up *fuuu*
         * @type {boolean}
         */
        vm.showUnavailable = {products: false};

        // TODO: Create proper filter from this?
        vm.filterOnlyZeroMissions = filterOnlyZeroMissions;
        vm.filterOnlyNonZeroMissions = filterOnlyNonZeroMissions;
        vm.getAvailableProductMissionsPoints = getAvailableProductMissionsPoints;
        vm.onMapCardClickHandler = onMapCardClickHandler;

        vm.$onInit = function() {
            pageTitleService.addCustomTitle(vm.location.name);

            if (backendService.isLoggedIn()) {
                missionService.getAvailableMissions(location).then(function(availableMissions) {
                    vm.locationMissions = availableMissions.locationMissions;
                    vm.specialMissions = availableMissions.specialMissions;
                    vm.productMissions = availableMissions.productMissions;
                });
            }
        };

        function filterOnlyZeroMissions(mission) {
            return (mission.points > 0);
        }

        function filterOnlyNonZeroMissions(mission) {
            return !vm.filterOnlyZeroMissions(mission);
        }

        /**
         * Returns the number of points that can be made with missions
         * for the given product.
         * TODO: this should go in a model
         * @param {Product} product
         * @returns {number}
         */
        function getAvailableProductMissionsPoints(product) {
            var points = 0;
            _.each(vm.productMissions[product.id], function(mission) {
                points += mission.getAvailablePoints();
            });
            return points;
        }

        vm.tasks = [
            {'task': 'Beurteile das Angebot dieser Location aus veganautischer Sicht.'},
            {'task': 'Gib an, wie offen das Personal hier für "vegan" ist.'},
            {'task': 'Sensibilisiere das Personal auf vegane Produkte.'}
        ];

        function onMapCardClickHandler() {

        }

        vm.editLocation = function editLocation() {
            vm.edit = !vm.edit;
        }
    }
})();