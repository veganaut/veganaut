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
        'veganaut.app.backend',
        'veganaut.app.community',
        'veganaut.app.filter',
        'veganaut.app.home',
        'veganaut.app.location',
        'veganaut.app.main',
        'veganaut.app.map',
        'veganaut.app.missions',
        'veganaut.app.products',
        'veganaut.app.search',
        'veganaut.app.session',
        'veganaut.app.templates',
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
            $routeProvider.when('/register', {
                vgRouteName: 'register',
                template: '<vg-register></vg-register>'
            });
            $routeProvider.when('/login', {
                vgRouteName: 'login',
                templateUrl: '/veganaut/user/login.tpl.html',
                controller: 'LoginCtrl'
            });
            $routeProvider.when('/forgot', {
                vgRouteName: 'forgotPassword',
                templateUrl: '/veganaut/user/forgot.tpl.html'
            });
            $routeProvider.when('/reset/:token', {
                vgRouteName: 'resetPassword',
                templateUrl: '/veganaut/user/reset.tpl.html'
            });

            $routeProvider.when('/', {
                vgRouteName: 'home',
                template: '<vg-home></vg-home>'
            });
            $routeProvider.when('/map/', {
                vgRouteName: 'map',
                vgFilters: {
                    type: true,
                    recent: true
                },
                template: '<vg-main-map></vg-main-map>',
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });
            $routeProvider.when('/list/', {
                vgRouteName: 'list',
                vgFilters: {
                    type: true,
                    recent: true
                },
                template: '<vg-list></vg-list>'
            });

            // Location list (with trailing slash for Piwik)
            $routeProvider.when('/locations/', {
                vgRouteName: 'locationList',
                vgFilters: {
                    type: true,
                    recent: true
                },
                template: '<vg-location-list-page></vg-location-list-page>',
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });
            $routeProvider.when('/location-legacy/:id', {
                vgRouteName: 'locationLegacy',
                templateUrl: '/veganaut/map/locationDetails.tpl.html',
                controller: 'LocationDetailsCtrl'
            });
            $routeProvider.when('/location/:id', {
                vgRouteName: 'location',
                template: '<vg-location-details vg-location="$resolve.location"></vg-location-details>',
                resolve: {
                    location: resolveLocation
                }
            });
            $routeProvider.when('/location/:id/edit', {
                vgRouteName: 'location.edit',
                templateUrl: '/veganaut/map/editLocation.tpl.html'
            });
            $routeProvider.when('/products', {
                vgRouteName: 'productList',
                vgFilters: {
                    type: true
                },
                template: '<vg-product-list-page></vg-product-list-page>',
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });
            $routeProvider.when('/me', {
                vgRouteName: 'ownProfile',
                templateUrl: '/veganaut/user/profile.tpl.html'
            });
            $routeProvider.when('/me/edit', {
                vgRouteName: 'ownProfile.edit',
                templateUrl: '/veganaut/user/editProfile.tpl.html'
            });
            $routeProvider.when('/community', {
                vgRouteName: 'community',
                template: '<vg-community></vg-community>'
            });
            $routeProvider.when('/veganaut/:personId', {
                vgRouteName: 'otherProfile',
                templateUrl: '/veganaut/user/person.tpl.html',
                controller: 'PersonCtrl'
            });

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

    // TODO: get rid of all the modules? Not sure if they add anything...
    // Main module for components that don't belong anywhere particular
    var mainModule = angular.module('veganaut.app.main', []);

    // Define the different modules of the app
    var mapModule = angular.module('veganaut.app.map', []);
    var missionsModule = angular.module('veganaut.app.missions', []);
    var userModule = angular.module('veganaut.app.user', []);

    // New and refactored modules are not exposed through a global anymore
    angular.module('veganaut.app.community', []);
    angular.module('veganaut.app.filter', []);
    angular.module('veganaut.app.home', []);
    angular.module('veganaut.app.location', []);
    angular.module('veganaut.app.products', []);
    angular.module('veganaut.app.search', []);

    // Make Leaflet available as angular service
    mapModule.value('Leaflet', window.L);

    window.veganaut = {
        mainModule: mainModule,
        mapModule: mapModule,
        missionsModule: missionsModule,
        userModule: userModule
    };

    resolveLocation.$inject = ['$route', 'locationService'];
    function resolveLocation($route, locationService) {
        var locationId = $route.current.params.id;
        return locationService.getLocation(locationId);
    }
})();
