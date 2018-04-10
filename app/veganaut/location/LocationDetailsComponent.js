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
        'pageTitleService',
        'backendService',
        'missionService'
    ];

    function LocationDetailsComponentController(pageTitleService, backendService, missionService) {
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

        vm.tasks = [
            {'task': 'Beurteile das Angebot dieser Location aus veganautischer Sicht.'},
            {'task': 'Gib an, wie offen das Personal hier für "vegan" ist.'},
            {'task': 'Sensibilisiere das Personal auf vegane Produkte.'}
        ];

        vm.editLocation = function editLocation() {
            vm.edit = !vm.edit;
        };
    }
})();
