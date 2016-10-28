angular.module('veganaut.app.main').factory('routeHelperService', [
    '$route',
    function($route) {
        'use strict';

        // TODO WIP: this service should not be necessary, can't one just attach a name/id to the route definition and check that?
        var PAGE_INFOS = {
            map: '/map/',
            list: '/locations/'
        };

        /**
         * Helper service around the angular $route service.
         * @constructor
         */
        var RouteHelperService = function() {
        };

        RouteHelperService.prototype.isCurrentPage = function(page) {
            return (
                PAGE_INFOS.hasOwnProperty(page) &&
                $route.current.originalPath === PAGE_INFOS[page]
            );
        };

        return new RouteHelperService();
    }
]);
