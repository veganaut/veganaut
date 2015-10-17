'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('config', function() {
    beforeEach(module('veganaut.app.main'));

    describe('backendUrl', function() {
        it('should define backend url', inject(function(backendUrl) {
            expect(backendUrl).toMatch(/https?:\/\//);
        }));
    });

    describe('mapDefaults', function() {
        it('should define mapDefaults', inject(function(mapDefaults) {
            expect(typeof mapDefaults).toBe('object', 'mapDefaults is an object');
        }));
    });

    describe('appSettings', function() {
        it('should define the appSettings', inject(function(appSettings) {
            expect(appSettings).toBeDefined('appSettings is defined');
            expect(typeof appSettings).toBe('object', 'appSettings is an object');
            expect(typeof appSettings.html5Mode).toBe('boolean', 'has html5Mode setting');
            expect(typeof appSettings.debugInfo).toBe('boolean', 'has debugInfo setting');
        }));
    });
});
