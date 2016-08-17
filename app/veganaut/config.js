(function(module) {
    'use strict';
    // TODO: find a better way to switch between prod and dev config
    // Backend URL
//    module.value('backendUrl', 'https://veganaut.net/api');
    module.value('backendUrl', 'http://localhost:3000');

    // Different possible map tiles
    // var osmAttribution = '© <a href="http://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a> Data';
    var mapDefaults = {
        zoomControlPosition: 'bottomleft',
        worldCopyJump: true
    };

    // Humanitarian OSM Team Tiles
    // mapDefaults.tileLayer = 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png';
    // mapDefaults.tileLayerOptions = {
    //     attribution: osmAttribution + ' | <a href="https://hotosm.org/" target="_blank">HOT</a> Tiles'
    // };

    module.value('mapDefaults', mapDefaults);

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

    // Toggle features that aren't ready yet
    module.constant('featureToggle', {});
})(window.veganaut.mainModule);
