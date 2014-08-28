(function(module) {
    'use strict';
    // TODO: find a better way to switch between prod and dev config
    // Backend URL
//    module.value('backendUrl', 'https://veganaut.net/api');
    module.value('backendUrl', 'http://localhost:3000');

    // Mapbox tile layer only to be used in production
//    module.value('tileLayerUrl', 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png');
    module.value('tileLayerUrl', undefined);

    // Whether to use html5Mode, doesn't work in development where we are in a sub directory
//    module.constant('useHtml5Mode', true);
    module.constant('useHtml5Mode', false);
})(window.veganaut.mainModule);
