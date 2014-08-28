'use strict';

// TODO: rename and move all the unit test

/* global describe, beforeEach, it, expect, inject */
describe('config', function() {
    beforeEach(module('veganaut.app.main'));

    describe('backendUrl', function() {
        it('should define backend url', inject(function(backendUrl) {
            // Version must be in the format x.y.z with an optional "-something", e.g. "-beta1"
            expect(backendUrl).toMatch(/https?:\/\//);
        }));
    });

    describe('tileLayerUrl', function() {
        it('should define the tileLayerUrl', inject(function(tileLayerUrl) { // jshint ignore:line
            // Dummy test to see if we can inject tileLayerUrl (because it can be undefined or a string)
            expect(true).toBe(true);
        }));
    });

    describe('useHtml5Mode', function() {
        it('should define the useHtml5Mode', inject(function(useHtml5Mode) {
            expect(useHtml5Mode).toBeDefined();
            expect(typeof useHtml5Mode).toBe('boolean');
        }));
    });
});
