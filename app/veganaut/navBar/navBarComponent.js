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
        'backendService',
        'localeService',
        'searchService'
    ];

    function NavBarController($location, $rootScope, backendService, localeService, searchService) {
        var $ctrl = this;

        // Expose service
        $ctrl.localeService = localeService;

        $ctrl.$onInit = function() {
        };

        $ctrl.closeMenu = function() {
            $ctrl.menuShown = false;
        };

        /**
         * Handler for clicks on search button
         */
        $ctrl.searchClick = function() {
            searchService.toggleSearchModal();
        };

        $ctrl.goToView = $rootScope.goToView;

        // TODO: Merge this with other places where this is checked
        $ctrl.isHomePage = function() {
            return $location.path() === '/';
        };

        $ctrl.isMapPage = function() {
            return $location.path() === '/map/';
        };

        $ctrl.isListPage = function() {
            return $location.path() === '/list/';
        };

        $ctrl.isAreaPage = function() {
            return $location.path() === '/panorama/';
        };


        $ctrl.isLoggedIn = function() {
            return backendService.isLoggedIn();
        };
    }
})();
