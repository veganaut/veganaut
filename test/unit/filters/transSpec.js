'use strict';

/* global describe, beforeEach, it, expect, inject, jasmine */
describe('trans filter', function() {
    var translateMock;
    beforeEach(module('monkeyFace.filters'));

    beforeEach(module(function($provide) {
        translateMock = jasmine.createSpy('translate');
        $provide.value('translate', translateMock);
    }));

    it('should pass translations to the translate service"', inject(function(transFilter) {
        transFilter('test');
        expect(translateMock).toHaveBeenCalledWith('test');

        transFilter('another.test');
        expect(translateMock).toHaveBeenCalledWith('another.test');

        expect(translateMock.calls.length).toBe(2, 'called translate twice in total');
    }));
});
