(function() {
    'use strict';

    /* Filters */
    var monkeyFaceFilters = angular.module('monkeyFace.filters', []);

    monkeyFaceFilters.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);
})();
