(function() {
    'use strict';

    /* Filters */
    var monkeyFaceFilters = angular.module('monkeyFace.filters', []);

    monkeyFaceFilters.filter('trans', ['localeProvider', function(localeProvider) {
        var trans = localeProvider.translations;
        return function(text) {
            return (trans.hasOwnProperty(text)) ? trans[text] : text;
        };
    }]);
})();
