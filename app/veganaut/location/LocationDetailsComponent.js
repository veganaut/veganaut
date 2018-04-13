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
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/location/locationDetailsComponent.html'
        };

        return component;
    }

    LocationDetailsComponentController.$inject = [
        'pageTitleService'
    ];

    function LocationDetailsComponentController(pageTitleService) {
        var $ctrl = this;

        // TODO WIP: handle location not found nicely

        /**
         * Whether we are currently in edit mode
         * @type {boolean}
         */
        $ctrl.editMode = false;

        /**
         * Which edit task is currently shown in the overlay
         * @type {string}
         */
        $ctrl.editTask = undefined;

        /**
         * Whether to show also the unavailable products
         * TODO: this is an object because we don't have controller-as so scopes get messed up *fuuu*
         * @type {boolean}
         */
        $ctrl.showUnavailable = {products: false};

        $ctrl.$onInit = function() {
            pageTitleService.addCustomTitle($ctrl.location.name);
        };

        $ctrl.tasks = [
            {'task': 'Beurteile das Angebot dieser Location aus veganautischer Sicht.'},
            {'task': 'Gib an, wie offen das Personal hier für "vegan" ist.'},
            {'task': 'Sensibilisiere das Personal auf vegane Produkte.'}
        ];

        $ctrl.toggleEditMode = function() {
            // TODO WIP: call setEditing() on location model?
            $ctrl.editMode = !$ctrl.editMode;
        };

        $ctrl.closeEditOverlay = function() {
            $ctrl.editTask = undefined;
        };

        $ctrl.startEditTask = function(property) {
            $ctrl.editTask = property;
        };
    }
})();
