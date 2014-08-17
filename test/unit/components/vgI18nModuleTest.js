'use strict';

/* global jasmine, describe, beforeEach, it, expect, inject */
describe('translateService', function() {
    beforeEach(module('veganaut.i18n'));

    describe('translateService', function() {
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

    describe('transFilter', function() {
        var translateMock;

        beforeEach(module(function($provide) {
            translateMock = jasmine.createSpy('translateService');
            $provide.value('translateService', translateMock);
        }));

        it('should pass translations to the translate service"', inject(function(transFilter) {
            transFilter('test');
            expect(translateMock).toHaveBeenCalledWith('test');

            transFilter('another.test');
            expect(translateMock).toHaveBeenCalledWith('another.test');

            expect(translateMock.calls.length).toBe(2, 'called translate twice in total');
        }));
    });
});
