(function() {
    'use strict';


    /**
     * Component for areaOverview. Presents all restaurants and stores in one view
     * @returns {{controller: navBarOverlayCtrl, controllerAs: string, templateUrl: string}}
     */
    function navBarOverlayComponent() {
        return {
            require: {parent: "^^vgNavBar"},
            controller: navBarOverlayCtrl,
            controllerAs: '$ctrl',
            templateUrl: '/veganaut/navBar/navBarOverlay/navBarOverlay.tpl.html'

        };
    }

    navBarOverlayCtrl.$inject = [
        '$rootScope',
        'backendService'
    ];


    function navBarOverlayCtrl($rootScope, backendService) {
        var $ctrl = this;

        $ctrl.closeOverlay = function() {
            $ctrl.parent.closeMenu()
        };
        $ctrl.goToView = function(view) {
            $rootScope.goToView(view);
            $ctrl.closeOverlay();
        };
        $ctrl.isLoggedIn = function() {
            return backendService.isLoggedIn();
        };
    }


    // Expose as component
    angular.module('veganaut.app.main')
        .component('vgNavBarOverlay', navBarOverlayComponent());
})();
