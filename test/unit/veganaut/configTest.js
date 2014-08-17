'use strict';

// TODO: rename and move all the unit test

/* global describe, beforeEach, it, expect, inject */
describe('config', function() {
    beforeEach(module('veganaut.app.main'));

    describe('version', function() {
        it('should define valid version', inject(function(version) {
            // Version must be in the format x.y.z with an optional "-something", e.g. "-beta1"
            expect(version).toMatch(/\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?/);
        }));
    });

    describe('backendUrl', function() {
        it('should define backend url', inject(function(backendUrl) {
            // Version must be in the format x.y.z with an optional "-something", e.g. "-beta1"
            expect(backendUrl).toMatch(/https?:\/\//);
        }));
    });
});
