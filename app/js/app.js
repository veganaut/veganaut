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
        $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/socialGraph', {templateUrl: 'partials/socialGraph.html', controller: 'SocialGraphCtrl'});
        $routeProvider.when('/activity', {templateUrl: 'partials/activity.html', controller: 'ActivityLinkCtrl'});
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);


    // Add $onRootScope method for pub/sub
    // See https://github.com/angular/angular.js/issues/4574
    monkeyFace.config(function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate){

            $delegate.constructor.prototype.$onRootScope = function(name, listener){
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            };

            return $delegate;
        }]);
    });
})();
