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
        'veganaut.alert',
        'veganaut.form',
        'veganaut.geocode',
        'veganaut.angularPiwik',
        'veganaut.app.templates',
        'veganaut.app.main',
        'veganaut.app.session',
        'veganaut.app.backend',
        'veganaut.app.map',
        'veganaut.app.missions',
        'veganaut.app.score',
        'veganaut.app.user'
    ]);

    veganautModule.config([
        '$routeProvider', '$locationProvider', '$translateProvider', 'angularPiwikProvider',
        'useHtml5Mode', 'piwikSettings', 'i18nSettings',
        function($routeProvider, $locationProvider, $translateProvider, angularPiwikProvider,
            useHtml5Mode, piwikSettings, i18nSettings)
        {
            $locationProvider.html5Mode(useHtml5Mode);

            // TODO: get rid of all the controllers here and define them in the tempalte
            $routeProvider.when('/register', {templateUrl: '/veganaut/user/register.tpl.html', controller: 'RegisterCtrl'});
            $routeProvider.when('/login', {templateUrl: '/veganaut/user/login.tpl.html', controller: 'LoginCtrl'});
            $routeProvider.when('/forgot', {templateUrl: '/veganaut/user/forgot.tpl.html'});
            $routeProvider.when('/reset/:token', {templateUrl: '/veganaut/user/reset.tpl.html'});

            $routeProvider.when('/', {templateUrl: '/veganaut/home/home.tpl.html'});
            $routeProvider.when('/map', {
                templateUrl: '/veganaut/map/map.tpl.html',
                // Don't reload when get params or hash changes
                reloadOnSearch: false
            });
            $routeProvider.when('/location/:id', {templateUrl: '/veganaut/map/locationDetails.tpl.html'});
            $routeProvider.when('/location/:id/edit', {templateUrl: '/veganaut/map/editLocation.tpl.html'});
            $routeProvider.when('/me', {templateUrl: '/veganaut/user/profile.tpl.html'});
            $routeProvider.when('/me/edit', {templateUrl: '/veganaut/user/editProfile.tpl.html'});
            $routeProvider.when('/score', {templateUrl: '/veganaut/score/score.tpl.html'});
            $routeProvider.when('/veganaut/:personId', {templateUrl: '/veganaut/user/person.tpl.html', controller: 'PersonCtrl'});

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

    // Make d3js available as angular service
    mainModule.value('d3', window.d3);

    // Define the different modules of the app
    var mapModule = angular.module('veganaut.app.map', []);
    var missionsModule = angular.module('veganaut.app.missions', []);
    var scoreModule = angular.module('veganaut.app.score', []);
    var userModule = angular.module('veganaut.app.user', []);

    // Make Leaflet available as angular service
    mapModule.value('Leaflet', window.L);

    window.veganaut = {
        mainModule: mainModule,
        mapModule: mapModule,
        missionsModule: missionsModule,
        scoreModule: scoreModule,
        userModule: userModule
    };
})();
