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
        'angularPiwik',
        'backendService',
        'localeService',
        'searchService'
    ];

    function NavBarController($location, $rootScope, angularPiwik, backendService, localeService, searchService) {
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

        $ctrl.goToView = function(view) {
            $rootScope.goToView(view);
        };

        $ctrl.logout = function() {
            backendService.logout().finally(function() {
                angularPiwik.track('logout', 'logout.success');
            });
        };

        $ctrl.isHomePage = function() {
            return $location.path() === '/';
        };

        $ctrl.isLoggedIn = function() {
            return backendService.isLoggedIn();
        };
    }
})();
