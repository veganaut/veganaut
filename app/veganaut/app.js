(function() {
    'use strict';

    // Declare the main module taking all other modules together
    var veganautModule = angular.module('veganaut.app', [
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'angular-loading-bar',
        'leaflet-directive',
        'pascalprecht.translate',
        'veganaut.ui',
        'veganaut.alert',
        'veganaut.form',
        'veganaut.geocode',
        'veganaut.angularPiwik',
        'veganaut.app.templates',
        'veganaut.app.main',
        'veganaut.app.session',
        'veganaut.app.backend',
        'veganaut.app.location',
        'veganaut.app.map',
        'veganaut.app.missions',
        'veganaut.app.community',
        'veganaut.app.user'
    ]);

    veganautModule.config([
        '$routeProvider', '$locationProvider', '$compileProvider', '$translateProvider',
        'angularPiwikProvider', 'appSettings', 'piwikSettings', 'i18nSettings',
        function($routeProvider, $locationProvider, $compileProvider, $translateProvider,
            angularPiwikProvider, appSettings, piwikSettings, i18nSettings)
        {
            // Configure general settings
            $locationProvider.html5Mode(appSettings.html5Mode);
            $compileProvider.debugInfoEnabled(appSettings.debugInfo);

            // Set up routes
            $routeProvider.when('/register', {template: '<vg-register></vg-register>'});
            $routeProvider.when('/login', {templateUrl: '/veganaut/user/login.tpl.html', controller: 'LoginCtrl'});
            $routeProvider.when('/forgot', {templateUrl: '/veganaut/user/forgot.tpl.html'});
            $routeProvider.when('/reset/:token', {templateUrl: '/veganaut/user/reset.tpl.html'});

            $routeProvider.when('/', {templateUrl: '/veganaut/home/home.tpl.html'});
            $routeProvider.when('/map', {
                templateUrl: '/veganaut/map/map.tpl.html',
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });

            // Location list (with trailing slash for Piwik)
            $routeProvider.when('/list/locations/', {template: '<vg-location-list></vg-location-list>'});
            $routeProvider.when('/location/:id', {templateUrl: '/veganaut/map/locationDetails.tpl.html'});
            $routeProvider.when('/location/:id/edit', {templateUrl: '/veganaut/map/editLocation.tpl.html'});
            $routeProvider.when('/me', {templateUrl: '/veganaut/user/profile.tpl.html'});
            $routeProvider.when('/me/edit', {templateUrl: '/veganaut/user/editProfile.tpl.html'});
            $routeProvider.when('/community', {templateUrl: '/veganaut/community/community.tpl.html'});
            $routeProvider.when('/veganaut/:personId', {templateUrl: '/veganaut/user/person.tpl.html', controller: 'PersonCtrl'});

            // Legacy URL redirects
            $routeProvider.when('/score', {redirectTo: '/community'});
            $routeProvider.when('/list', {redirectTo: '/list/locations/'});

            $routeProvider.otherwise({redirectTo: '/'});
            // TODO: make sure only routes are accessed that are allowed for the current situation (e.g. logged out)

            // Set up translations
            $translateProvider.useStaticFilesLoader({
                prefix: 'locale/',
                suffix: '.json'
            });
            $translateProvider.registerAvailableLanguageKeys(i18nSettings.availableLocales);
            $translateProvider.fallbackLanguage(i18nSettings.defaultLocale);
            $translateProvider.determinePreferredLanguage();
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

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
    veganautModule.config(['$provide', function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            $delegate.constructor.prototype.$onRootScope = function(name, listener) {
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            };

            return $delegate;
        }]);
    }]);

    // Main module for components that don't belong anywhere particular
    var mainModule = angular.module('veganaut.app.main', []);

    // Define the different modules of the app
    var locationModule = angular.module('veganaut.app.location', []);
    var mapModule = angular.module('veganaut.app.map', []);
    var missionsModule = angular.module('veganaut.app.missions', []);
    var communityModule = angular.module('veganaut.app.community', []);
    var userModule = angular.module('veganaut.app.user', []);

    // Make Leaflet available as angular service
    mapModule.value('Leaflet', window.L);

    window.veganaut = {
        mainModule: mainModule,
        locationModule: locationModule,
        mapModule: mapModule,
        missionsModule: missionsModule,
        communityModule: communityModule,
        userModule: userModule
    };
})();
