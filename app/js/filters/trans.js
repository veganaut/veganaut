(function(filtersModule) {
    'use strict';

    filtersModule.filter('trans', ['localeProvider', function(localeProvider) {
        var trans = localeProvider.translations;
        return function(text) {
            return (trans.hasOwnProperty(text)) ? trans[text] : text;
        };
    }]);
})(window.monkeyFace.filtersModule);
