(function() {
    'use strict';

    // Declare the main module taking all other modules together
    var veganautModule = angular.module('veganaut.app', [
        'ngRoute',
        'ui.bootstrap',
        'leaflet-directive',
        'veganaut.alert',
        'veganaut.form',
        'veganaut.i18n',
        'veganaut.app.main',
        'veganaut.app.map',
        'veganaut.app.score',
        'veganaut.app.socialGraph',
        'veganaut.app.user'
    ]);

    veganautModule.config(['$routeProvider', '$locationProvider', 'useHtml5Mode',
        function($routeProvider, $locationProvider, useHtml5Mode) {
            $locationProvider.html5Mode(useHtml5Mode);

            $routeProvider.when('/', {templateUrl: 'veganaut/front/front.tpl.html'});
            $routeProvider.when('/register', {templateUrl: 'veganaut/user/register.tpl.html', controller: 'RegisterCtrl'});
            $routeProvider.when('/login', {templateUrl: 'veganaut/user/login.tpl.html', controller: 'LoginCtrl'});
            $routeProvider.when('/socialGraph', {templateUrl: 'veganaut/socialGraph/socialGraph.tpl.html', controller: 'SocialGraphCtrl'});
            $routeProvider.when('/createActivity/:target?', {templateUrl: 'veganaut/socialGraph/activity.tpl.html'});
            $routeProvider.when('/openActivities', {templateUrl: 'veganaut/socialGraph/openActivities.tpl.html', controller: 'OpenActivitiesCtrl'});
            $routeProvider.when('/referenceCode', {templateUrl: 'veganaut/socialGraph/referenceCode.tpl.html', controller: 'ReferenceCodeCtrl'});
            $routeProvider.when('/map', {templateUrl: 'veganaut/map/map.tpl.html'});
            $routeProvider.when('/map/location/:id', {templateUrl: 'veganaut/map/locationDetails.tpl.html'});
            $routeProvider.when('/me', {templateUrl: 'veganaut/user/profile.tpl.html'});
            $routeProvider.when('/me/edit', {templateUrl: 'veganaut/user/editProfile.tpl.html'});
            $routeProvider.otherwise({redirectTo: '/'});
            // TODO: make sure only routes are accessed that are allowed for the current situation (e.g. logged out)
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
