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
        'veganaut.app.tasks',
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

            // TODO WIP: make sure old routes are redirected in a way that makes sense
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
                    granularity: true,
                    recent: true
                },
                template: '<vg-main-map></vg-main-map>',
                resolve: {
                    areaInitialised: resolveInitialiseArea
                },
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });
            $routeProvider.when('/list/', {
                vgRouteName: 'list',
                vgFilters: {
                    type: true,
                    granularity: true,
                    recent: true,
                    sortBy: true
                },
                template: '<vg-list></vg-list>',
                resolve: {
                    areaInitialised: resolveInitialiseArea
                },
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });

            // Location list (with trailing slash for Piwik)
            $routeProvider.when('/locations/', {
                redirectTo: '/list/' // location list is now in the list page. TODO: This could be removed at some point
            });

            $routeProvider.when('/area/', {
                vgRouteName: 'areaOverview',
                template: '<vg-area-overview></vg-area-overview>',
                resolve: {
                    areaInitialised: resolveInitialiseArea
                },
                // Don't reload when get params or hash changes
                reloadOnSearch: false
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
                redirectTo: '/list/?granularity=product' // product list is now in the list page. TODO: This could be removed at some point
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
    var tasksModule = angular.module('veganaut.app.tasks', []);
    var userModule = angular.module('veganaut.app.user', []);

    // New and refactored modules are not exposed through a global anymore
    angular.module('veganaut.app.community', []);
    angular.module('veganaut.app.filter', []);
    angular.module('veganaut.app.home', []);
    angular.module('veganaut.app.location', []);
    angular.module('veganaut.app.products', []);
    angular.module('veganaut.app.search', []);

    // Make Leaflet and other libraries available as angular service
    mapModule.value('Leaflet', window.L);
    mapModule.value('slug', window.slug);
    mapModule.value('spirit', window.spirit);

    window.veganaut = {
        mainModule: mainModule,
        mapModule: mapModule,
        tasksModule: tasksModule,
        userModule: userModule
    };

    resolveLocation.$inject = ['$route', 'locationService'];
    function resolveLocation($route, locationService) {
        var locationId = $route.current.params.id;
        return locationService.getLocation(locationId);
    }

    resolveInitialiseArea.$inject = ['areaService'];
    function resolveInitialiseArea(areaService) {
        return areaService.initialised();
    }
})();
