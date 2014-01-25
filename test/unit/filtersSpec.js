'use strict';

/* jasmine specs for filters go here */
/* global describe, beforeEach, it, expect, inject */
describe('filter', function() {
    beforeEach(module('monkeyFace.filters'));


    describe('interpolate', function() {
        beforeEach(module(function($provide) {
            $provide.value('version', 'TEST_VER');
        }));


        it('should replace VERSION', inject(function(interpolateFilter) {
            expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
        }));
    });
});
