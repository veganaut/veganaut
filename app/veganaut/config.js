(function(module) {
    'use strict';
    module.value('version', '0.0.1');

    module.value('backendUrl', 'http://localhost:3000');

    // Mapbox tile layer only to be used in production
//    module.value('tileLayerUrl', 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png');
    module.value('tileLayerUrl', undefined);
})(window.veganaut.mainModule);
