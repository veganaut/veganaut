(function() {
    'use strict';

    angular
        .module('veganaut.app.main')
        .component('vgNavBar', navBarComponent());

    function navBarComponent() {
        var component = {
            bindings: {
                menuShown: '=vgMenuShown'
            },
            controller: NavBarController,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/navBar/navBarComponent.html'
        };

        return component;
    }

    NavBarController.$inject = [
        '$location',
        '$rootScope',
        'localeService'
    ];

    function NavBarController($location, $rootScope, localeService) {
        var $ctrl = this;

        // Expose service
        $ctrl.$location = $location;
        $ctrl.localeService = localeService;

        $ctrl.$onInit = function() {
        };

        $ctrl.closeMenu = function() {
            $ctrl.menuShown = false;
        };

        // This does not get called. TODO: Figure out why and fix it
        $ctrl.goToView = function(view) {
            console.log(view);
            $rootScope.goToView(view);
        };
    }
})();
