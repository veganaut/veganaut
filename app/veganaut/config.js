(function(module) {
    'use strict';
    // TODO: find a better way to switch between prod and dev config
    // Backend URL
//    module.value('backendUrl', 'https://veganaut.net/api');
    module.value('backendUrl', 'http://localhost:3000');

    // Different possible map tiles
    var osmAttribution = '© <a href="http://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a> Data';
    // TODO: add terms or licence link, see http://wiki.openstreetmap.org/wiki/Legal_FAQ
    // Mapbox tiles: only for production
//    module.value('mapDefaults', {
//        tileLayer: 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png',
//        tileLayerOptions: {
//            attribution: osmAttribution + ' | <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> Tiles'
//        }
//    });

    // Stamen Toner tiles
//    module.value('mapDefaults', {
//        tileLayer: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
//        tileLayerOptions: {
//            subdomains: 'abcd',
//            attribution: osmAttribution + ' | <a href="http://stamen.com/" target="_blank">Stamen</a> Tiles'
//        }
//    });

    // Mapquest tiles
    module.value('mapDefaults', {
        tileLayer: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',
        tileLayerOptions: {
            subdomains: '1234',
            attribution: osmAttribution + ' | <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> Tiles'
        }
    });


    // Whether to use html5Mode
    module.constant('useHtml5Mode', true);
})(window.veganaut.mainModule);
