(function() {
    'use strict';

    /**
     * Module for handling i18n.
     *
     * @type {module}
     */
    var i18nModule = angular.module('veganaut.i18n', []);

    /**
     * translateService provides methods to translate strings
     */
    i18nModule.provider('translateService', function() {
        /**
         * Recursively goes through the given dictionary to find the translation.
         *
         * @param {object} dictionary
         * @param {array} textParts
         * @param {number} [currentIndex=0]
         * @returns {string}
         *
         * @throws If the translation is not found, an Error is thrown
         *
         * @example
         * // Will log "translated"
         * console.log(recursiveTranslate({test: {nested: 'translated'}}, ['test', 'nested']));
         *
         * // Will throw an error
         * console.log(recursiveTranslate({test: {nested: 'translated'}}, ['test', 'something']));
         */
        var recursiveTranslate = function(dictionary, textParts, currentIndex) {
            currentIndex = currentIndex || 0;
            var currentKey = textParts[currentIndex];
            if (dictionary.hasOwnProperty(currentKey)) {
                var currentValue = dictionary[currentKey];
                if (textParts.length === currentIndex + 1 && angular.isString(currentValue)) {
                    return currentValue;
                }
                else if (textParts.length > currentIndex + 1 && angular.isObject(currentValue)) {
                    return recursiveTranslate(currentValue, textParts, currentIndex + 1);
                }
            }

            throw new Error('Translation "' + textParts.join('.') + '" not found.');
        };

        /**
         * Attempts to translate the given text.
         * The text is a dot separated label. Returns the text unchanged if the
         * translation is not found.
         *
         * @param {object} dictionary
         * @param {string} text
         * @returns {string}
         */
        var translate = function(dictionary, text) {
            var parts = text.split('.');
            try {
                return recursiveTranslate(dictionary, parts);
            }
            catch (err) {
                // TODO: Tell someone about the translation error?
                return text;
            }
        };

        this.$get = ['localeService', function(localeService) {
            return function(text) {
                return translate(localeService, text);
            };
        }];
    });

    /**
     * Simple filter that translates strings with the help of the translate service
     */
    i18nModule.filter('trans', ['translateService', function(translate) {
        return function(text) {
            return translate(text);
        };
    }]);
})();
