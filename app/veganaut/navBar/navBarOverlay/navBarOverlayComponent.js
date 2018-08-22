(function() {
    'use strict';


    /**
     * Component for the main menu overlay
     * @returns {{}}
     */
    function navBarOverlayComponent() {
        return {
            require: {parent: '^^vgNavBar'},
            controller: NavBarOverlayCtrl,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/navBar/navBarOverlay/navBarOverlay.tpl.html'

        };
    }

    NavBarOverlayCtrl.$inject = [
        '$rootScope',
        'angularPiwik',
        'backendService'
    ];


    function NavBarOverlayCtrl($rootScope, angularPiwik, backendService) {
        var $ctrl = this;

        $ctrl.closeOverlay = function() {
            $ctrl.parent.closeMenu();
        };
        $ctrl.goToView = function(view) {
            $rootScope.goToView(view);
            $ctrl.closeOverlay();
        };
        $ctrl.logout = function() {
            angularPiwik.track('logout', 'logout');
            backendService.logout();
        };
        $ctrl.isLoggedIn = function() {
            return backendService.isLoggedIn();
        };
    }


    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgNavBarOverlay', navBarOverlayComponent());
})();
