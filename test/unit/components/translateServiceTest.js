'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('translateService', function() {
    beforeEach(module('monkeyFace.services'));

    beforeEach(module(function($provide) {
        $provide.value('localeService', {
            test: 'le test',
            nested: {
                test: 'it is nested'
            }
        });
    }));

    it('should expose translation methods', inject(function(translateService) {
        expect(typeof translateService).toEqual('function');
    }));

    it('should translate "test"', inject(function(translateService) {
        expect(translateService('test')).toEqual('le test');
    }));

    it('supports nested translation strings', inject(function(translateService) {
        expect(translateService('nested.test')).toEqual('it is nested');
    }));

    it('should return the value if there is no translation found', inject(function(translateService) {
        expect(translateService('unknown')).toEqual('unknown');
        expect(translateService('unknown.translation.string')).toEqual('unknown.translation.string');
        expect(translateService('nested.test.bla')).toEqual('nested.test.bla');
        expect(translateService('nested')).toEqual('nested');
    }));
});
