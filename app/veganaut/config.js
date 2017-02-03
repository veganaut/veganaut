(function(module) {
    'use strict';
    // TODO: find a better way to switch between prod and dev config
    // Backend URL
//    module.value('backendUrl', 'https://veganaut.net/api');
    module.value('backendUrl', 'http://localhost:3000');

    // Map default settings
    module.value('mapDefaults', {
        zoomControlPosition: 'bottomleft',
        worldCopyJump: true
    });

    // General app settings
    module.constant('appSettings', {
        html5Mode: true,
        debugInfo: true
    });

    // Piwik settings
    module.constant('piwikSettings', {
        enabled: false,
        domain: 'https://veganaut.net/piwik',
        siteId: 8
    });

    // Translation settings
    module.constant('i18nSettings', {
        defaultLocale: 'en',
        availableLocales: ['en', 'de', 'fr'],
        localeNames: {
            de: 'Deutsch',
            en: 'English',
            fr: 'Français'
        }
    });

    // Some global constants
    module.constant('constants', {
        /**
         * Radius used when including the whole world on the location list.
         * @type {number} in meters
         */
        WHOLE_WORLD_RADIUS: 30000000,

        /**
         * Float precision: used for representing floats in URLs.
         * @type {number}
         */
        URL_FLOAT_PRECISION: 7,

        /**
         * Zoom above which to show the address type 'street'
         * (equal or below is for type 'city').
         * @type {number}
         */
        ADDRESS_TYPE_BOUNDARY_ZOOM: 13,

        /**
         * Radius above which to show the address type 'city'
         * (equal or below is for type 'street').
         * @type {number}
         */
        ADDRESS_TYPE_BOUNDARY_RADIUS: 5000
    });

    // Toggle features that aren't ready yet
    module.constant('featureToggle', {});
})(window.veganaut.mainModule);
