(function() {
    'use strict';

    // Declare the main module taking all other modules together
    var veganautModule = angular.module('veganaut.app', [
        'ngRoute',
        'ui.bootstrap',
        'angular-loading-bar',
        'leaflet-directive',
        'veganaut.alert',
        'veganaut.form',
        'veganaut.geocode',
        'veganaut.i18n',
        'veganaut.angularPiwik',
        'veganaut.app.main',
        'veganaut.app.session',
        'veganaut.app.backend',
        'veganaut.app.map',
        'veganaut.app.score',
        'veganaut.app.socialGraph',
        'veganaut.app.user'
    ]);

    veganautModule.config(['$routeProvider', '$locationProvider', 'angularPiwikProvider', 'useHtml5Mode', 'piwikSettings',
        function($routeProvider, $locationProvider, angularPiwikProvider, useHtml5Mode, piwikSettings) {
            $locationProvider.html5Mode(useHtml5Mode);

            $routeProvider.when('/register', {templateUrl: '/veganaut/user/register.tpl.html', controller: 'RegisterCtrl'});
            $routeProvider.when('/login', {templateUrl: '/veganaut/user/login.tpl.html', controller: 'LoginCtrl'});

            // Social graph is not active at the moment
//            $routeProvider.when('/socialGraph', {templateUrl: '/veganaut/socialGraph/socialGraph.tpl.html', controller: 'SocialGraphCtrl'});
//            $routeProvider.when('/createActivity/:target?', {templateUrl: '/veganaut/socialGraph/activity.tpl.html'});
//            $routeProvider.when('/activities', {templateUrl: '/veganaut/socialGraph/activities.tpl.html'});

            $routeProvider.when('/', {templateUrl: '/veganaut/map/map.tpl.html'});
            $routeProvider.when('/location/:id', {templateUrl: '/veganaut/map/locationDetails.tpl.html'});
            $routeProvider.when('/location/:id/edit', {templateUrl: '/veganaut/map/editLocation.tpl.html'});
            $routeProvider.when('/me', {templateUrl: '/veganaut/user/profile.tpl.html'});
            $routeProvider.when('/me/edit', {templateUrl: '/veganaut/user/editProfile.tpl.html'});
            $routeProvider.when('/score', {templateUrl: '/veganaut/score/score.tpl.html'});
            $routeProvider.otherwise({redirectTo: '/'});
            // TODO: make sure only routes are accessed that are allowed for the current situation (e.g. logged out)

            // Configure piwik
            angularPiwikProvider.enableTracking(piwikSettings.enabled);
            if (piwikSettings.enabled) {
                angularPiwikProvider.setPiwikDomain(piwikSettings.domain);
                angularPiwikProvider.setSiteId(piwikSettings.siteId);
            }
        }
    ]);


    // Add $onRootScope method for pub/sub
    // See https://github.com/angular/angular.js/issues/4574
    veganautModule.config(function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            $delegate.constructor.prototype.$onRootScope = function(name, listener) {
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            };

            return $delegate;
        }]);
    });

    // Main module for components that don't belong anywhere particular
    var mainModule = angular.module('veganaut.app.main', []);

    // Make d3js available as angular service
    mainModule.value('d3', window.d3);

    // Make bootstrap-tour available as angular service
    mainModule.value('Tour', window.Tour);

    // TODO: should they correctly depend on each other?
    var mapModule = angular.module('veganaut.app.map', []);
    var scoreModule = angular.module('veganaut.app.score', []);
    var socialGraphModule = angular.module('veganaut.app.socialGraph', []);
    var userModule = angular.module('veganaut.app.user', []);

    window.veganaut = {
        mainModule: mainModule,
        mapModule: mapModule,
        scoreModule: scoreModule,
        socialGraphModule: socialGraphModule,
        userModule: userModule
    };
})();
