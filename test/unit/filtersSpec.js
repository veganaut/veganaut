'use strict';

/* jasmine specs for filters go here */
/* global describe, beforeEach, it, expect, inject */
describe('filter', function() {
    beforeEach(module('monkeyFace.filters'));


    describe('trans', function() {
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
});
