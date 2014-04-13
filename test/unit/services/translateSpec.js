'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('translate service', function() {
    beforeEach(module('monkeyFace.services'));

    beforeEach(module(function($provide) {
        $provide.value('locale', {
            test: 'le test'
        });
    }));

    it('should expose translation methods', inject(function(translate) {
        expect(typeof translate).toEqual('function');
    }));

    it('should translate "test"', inject(function(translate) {
        expect(translate('test')).toEqual('le test');
    }));

    it('should return the value if there is no translation found', inject(function(translate) {
        expect(translate('unknown.translation.string')).toEqual('unknown.translation.string');
    }));
});
