'use strict';

/* jasmine specs for services go here */
/* global describe, beforeEach, it, expect, inject */
describe('service', function() {
    beforeEach(module('monkeyFace.services'));


    describe('version', function() {
        it('should return current version', inject(function(version) {
            expect(version).toEqual('0.0.1');
        }));
    });
});
