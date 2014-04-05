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

        // Add activity link
        var req = backend.addActivityLink('Tester', { id: '1'});
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    it('should have a getMatch method', inject(function($httpBackend, backend) {
        // Define our expectations
        $httpBackend.expectGET('/match')
            .respond({
                blue: {
                    score: 113,
                    users: 130,
                    babies: 20,
                    captured: 27
                },
                green: {
                    score: 85,
                    users: 105,
                    babies: 18,
                    captured: 29
                }
            })
        ;


        expect(typeof backend.getMatch).toBe('function');

        // Get the match
        var req = backend.getMatch();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    it('should have a getMe method', inject(function($httpBackend, backend) {
        // Define our expectations
        $httpBackend.expectGET('/person/me')
            .respond({
                email: 'foo@bar.baz',
                nickName: 'Zorg-81201',
                fullName: 'Alice Alison',
                team: 'blue',
                role: 'veteran',
                id: '000000000000000000000001',
                type: 'user',
                strength: 12,
                hits: 0,
                isCaptured: false
            })
        ;

        expect(typeof backend.getMe).toBe('function');

        // Get the match
        var req = backend.getMe();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    // TODO: test other backend methods
});
