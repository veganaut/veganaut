(function(module) {
    'use strict';
    // TODO: find a better way to switch between prod and dev config
    // Backend URL
//    module.value('backendUrl', 'https://veganaut.net/api');
    module.value('backendUrl', 'http://localhost:3000');

    // Different possible map tiles
    var osmAttribution = '© <a href="http://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a> Data';
    var mapDefaults = {
        zoomControlPosition: 'bottomleft',
        worldCopyJump: true
    };

    // TODO: add terms or licence link, see http://wiki.openstreetmap.org/wiki/Legal_FAQ
    // Mapbox tiles: only for production
//    mapDefaults.tileLayer = 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png';
//    mapDefaults.tileLayerOptions = {
//        attribution: osmAttribution + ' | <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> Tiles'
//    };

    // Stamen Toner tiles
//    mapDefaults.tileLayer = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
//    mapDefaults.tileLayerOptions = {
//        attribution: osmAttribution + ' | <a href="http://stamen.com/" target="_blank">Stamen</a> Tiles'
//    };

    // Mapquest tiles
    mapDefaults.tileLayer = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
    mapDefaults.tileLayerOptions = {
        subdomains: '1234',
        attribution: osmAttribution + ' | <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> Tiles'
    };

    module.value('mapDefaults', mapDefaults);

    // Whether to use html5Mode
    module.constant('useHtml5Mode', true);

    // Piwik settings
    module.constant('piwikSettings', {
        enabled: false,
        domain: 'veganaut.net/piwik',
        siteId: 7
    });
})(window.veganaut.mainModule);
