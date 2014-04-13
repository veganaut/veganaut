'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('translate service', function() {
    beforeEach(module('monkeyFace.services'));

    beforeEach(module(function($provide) {
        $provide.value('locale', {
            test: 'le test',
            nested: {
                test: 'it is nested'
            }
        });
    }));

    it('should expose translation methods', inject(function(translate) {
        expect(typeof translate).toEqual('function');
    }));

    it('should translate "test"', inject(function(translate) {
        expect(translate('test')).toEqual('le test');
    }));

    it('supports nested translation strings', inject(function(translate) {
        expect(translate('nested.test')).toEqual('it is nested');
    }));

    it('should return the value if there is no translation found', inject(function(translate) {
        expect(translate('unknown')).toEqual('unknown');
        expect(translate('unknown.translation.string')).toEqual('unknown.translation.string');
        expect(translate('nested.test.bla')).toEqual('nested.test.bla');
        expect(translate('nested')).toEqual('nested');
    }));
});
