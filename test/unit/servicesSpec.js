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


    describe('backend', function() {
        beforeEach(module(function($provide) {
            $provide.value('backendUrl', '');
        }));

        it('should have a submit method', inject(function($httpBackend, backend) {
            // Set up the http backend mock
            $httpBackend.expectPOST('/session', {email: 'e@mail.com', password: 'word'}).respond();

            expect(typeof backend.login).toBe('function');

            // Use login
            var req = backend.login('e@mail.com', 'word');
            $httpBackend.flush();

            // Make sure we got a $http object
            expect(typeof req.then).toBe('function');
            expect(typeof req.success).toBe('function');
            expect(typeof req.error).toBe('function');
        }));
    });
});
