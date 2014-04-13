'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('trans filter', function() {
    beforeEach(module('monkeyFace.filters'));

    beforeEach(module(function($provide) {
        $provide.value('localeProvider', {
            translations: {
                test: 'le test'
            }
        });
    }));


    it('should translate "test"', inject(function(transFilter) {
        expect(transFilter('test')).toEqual('le test');
    }));

    it('should return the value if there is no translation found', inject(function(transFilter) {
        expect(transFilter('unknown.translation.string')).toEqual('unknown.translation.string');
    }));
});
