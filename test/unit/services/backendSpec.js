'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('backend service', function() {
    beforeEach(module('monkeyFace.services'));

    beforeEach(module(function($provide) {
        $provide.value('backendUrl', '');
    }));

    it('should have a isLoggedIn method', inject(function($httpBackend, backend) {
        expect(typeof backend.isLoggedIn).toBe('function');

        // Should not be logged in by default
//        expect(backend.isLoggedIn()).toBe(false);
        // TODO: this doesn't work because it stores the sid in the session storage
        // Need to mock the sessionStorage somehow
    }));

    it('should have a login method', inject(function($httpBackend, backend) {
        // Define our expectations
        $httpBackend.expectPOST('/session', {email: 'e@mail.com', password: 'word'})
            .respond({
                sessionId: 'test-session-d'
            })
        ;

        expect(typeof backend.login).toBe('function');

        // Use login
        var req = backend.login('e@mail.com', 'word');
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');

        // Should be logged in now
        expect(backend.isLoggedIn()).toBe(true);
    }));


    it('should have a addActivityLink method', inject(function($httpBackend, backend) {
        // Define our expectations
        var expectedPostData = {
            target: {
                fullName: 'Tester'
            },
            activity: {
                id: '1'
            }
        };
        $httpBackend.expectPOST('/activityLink', expectedPostData)
            .respond({
                referenceCode: 'ref-123'
            })
        ;

        expect(typeof backend.addActivityLink).toBe('function');

        // Use login
        var req = backend.addActivityLink('Tester', { id: '1'});
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

        // TODO: test other backend methods
});
