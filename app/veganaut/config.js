(function(servicesModule) {
    'use strict';
    servicesModule.value('version', '0.0.1');

    servicesModule.value('backendUrl', 'http://localhost:3000');

    // Mapbox tile layer only to be used in production
//    servicesModule.value('tileLayerUrl', 'https://{s}.tiles.mapbox.com/v3/toebu.ilh4kll0/{z}/{x}/{y}.png');
    servicesModule.value('tileLayerUrl', undefined);
})(window.monkeyFace.servicesModule);
