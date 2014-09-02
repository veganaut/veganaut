'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('config', function() {
    beforeEach(module('veganaut.app.main'));

    describe('backendUrl', function() {
        it('should define backend url', inject(function(backendUrl) {
            // Version must be in the format x.y.z with an optional "-something", e.g. "-beta1"
            expect(backendUrl).toMatch(/https?:\/\//);
        }));
    });

    describe('mapDefaults', function() {
        it('should define mapDefaults', inject(function(mapDefaults) {
            expect(typeof mapDefaults).toBe('object', 'mapDefaults is an object');
        }));
    });

    describe('useHtml5Mode', function() {
        it('should define the useHtml5Mode', inject(function(useHtml5Mode) {
            expect(useHtml5Mode).toBeDefined();
            expect(typeof useHtml5Mode).toBe('boolean');
        }));
    });
});
