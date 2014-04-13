(function(servicesModule) {
    'use strict';

    /**
     * translate provides methods to translate strings
     */
    servicesModule.provider('translate', function() {
        this.$get = ['locale', function(locale) {
            return function(text) {
                return (locale.hasOwnProperty(text)) ? locale[text] : text;
            };
        }];
    });
})(window.monkeyFace.servicesModule);
