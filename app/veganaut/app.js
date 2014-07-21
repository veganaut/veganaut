(function() {
    'use strict';

    // Declare app level module which depends on filters, and services
    var monkeyFaceModule = angular.module('monkeyFace', [
        'ngRoute',
        'ui.bootstrap',
        'leaflet-directive',
        'monkeyFace.filters',
        'monkeyFace.services',
        'monkeyFace.directives',
        'monkeyFace.controllers',
        'monkeyFace.models'
    ]);

    monkeyFaceModule.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'veganaut/front/front.html'});
        $routeProvider.when('/register', {templateUrl: 'veganaut/register/register.html', controller: 'RegisterCtrl'});
        $routeProvider.when('/login', {templateUrl: 'veganaut/login/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/socialGraph', {templateUrl: 'veganaut/socialGraph/socialGraph.html', controller: 'SocialGraphCtrl'});
        $routeProvider.when('/createActivity/:target?', {templateUrl: 'veganaut/activityLink/activity.html'});
        $routeProvider.when('/openActivities', {templateUrl: 'veganaut/openActivities/openActivities.html', controller: 'OpenActivitiesCtrl'});
        $routeProvider.when('/referenceCode', {templateUrl: 'veganaut/referenceCode/referenceCode.html', controller: 'ReferenceCodeCtrl'});
        $routeProvider.when('/map', {templateUrl: 'veganaut/map/map.html', controller: 'MapCtrl'});
        $routeProvider.when('/me', {templateUrl: 'veganaut/profile/profile.html'});
        $routeProvider.when('/me/edit', {templateUrl: 'veganaut/profile/editProfile.html'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
    // TODO: make sure only routes are accessed that are allowed for the current situation (e.g. logged out)


    // Add $onRootScope method for pub/sub
    // See https://github.com/angular/angular.js/issues/4574
    monkeyFaceModule.config(function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            $delegate.constructor.prototype.$onRootScope = function(name, listener) {
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            };

            return $delegate;
        }]);
    });

    // TODO: reorganise the modules semantically
    // Main service module
    var servicesModule = angular.module('monkeyFace.services', []);

    // Make d3js available as angular service
    servicesModule.value('d3', window.d3);

    // Make bootstrap-tour available as angular service
    servicesModule.value('Tour', window.Tour);

    // Main directives module
    var directivesModule = angular.module('monkeyFace.directives', []);

    // Main filter module
    var filtersModule = angular.module('monkeyFace.filters', []);

    // Main controllers module
    var controllersModule = angular.module('monkeyFace.controllers', []);

    // Main models module
    var modelsModule = angular.module('monkeyFace.models', []);

    window.monkeyFace = {
        appModule: monkeyFaceModule,
        servicesModule: servicesModule,
        directivesModule: directivesModule,
        filtersModule: filtersModule,
        controllersModule: controllersModule,
        modelsModule: modelsModule
    };
})();
