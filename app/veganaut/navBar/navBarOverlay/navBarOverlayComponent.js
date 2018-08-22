(function() {
    'use strict';


    /**
     * Component for the main menu overlay
     * @returns {{}}
     */
    function navBarOverlayComponent() {
        return {
            require: {
                parent: '^^vgNavBar'
            },
            controller: NavBarOverlayCtrl,
            templateUrl: '/veganaut/navBar/navBarOverlay/navBarOverlayComponent.html'
        };
    }

    NavBarOverlayCtrl.$inject = ['$location', 'backendService', 'mainMapService'];

    function NavBarOverlayCtrl($location, backendService, mainMapService) {
        var $ctrl = this;

        $ctrl.closeOverlay = function() {
            $ctrl.parent.closeMenu();
        };
        $ctrl.search = function() {
            $ctrl.closeOverlay();
            $ctrl.parent.searchClick();
        };
        $ctrl.addLocation = function() {
            $ctrl.closeOverlay();
            mainMapService.goToMapAndAddLocation();
        };
        $ctrl.goToView = function(view) {
            $location.url(view);
            $ctrl.closeOverlay();
        };
        $ctrl.logout = function() {
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
