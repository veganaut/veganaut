(function() {
    'use strict';

    // Declare app level module which depends on filters, and services
    var monkeyFace = angular.module('monkeyFace', [
        'ngRoute',
        'ui.bootstrap',
        'monkeyFace.filters',
        'monkeyFace.services',
        'monkeyFace.directives',
        'monkeyFace.controllers'
    ]);

    monkeyFace.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/socialGraph', {templateUrl: 'partials/socialGraph.html', controller: 'SocialGraphCtrl'});
        $routeProvider.when('/activity', {templateUrl: 'partials/activity.html', controller: 'ActivityInstanceCtrl'});
        $routeProvider.otherwise({redirectTo: '/socialGraph'});
    }]);
})();
