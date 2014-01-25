(function() {
    'use strict';

    /* Services */

    // Demonstrate how to register services
    // In this case it is a simple value service.
    var monkeyFaceServices = angular.module('monkeyFace.services', []);

    monkeyFaceServices.value('version', '0.0.1');
})();
