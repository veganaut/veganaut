'use strict';

/* global describe, beforeEach, it, expect, inject */
describe('backendService', function() {
    beforeEach(module('veganaut.app.main'));

    beforeEach(module(function($provide) {
        $provide.value('backendUrl', '');
        $provide.value('alertService', {});
    }));

    it('should have a isLoggedIn method', inject(function($httpBackend, backendService) {
        expect(typeof backendService.isLoggedIn).toBe('function');

        // Should not be logged in by default
//        expect(backendService.isLoggedIn()).toBe(false);
        // TODO: this doesn't work because it stores the sid in the session storage
        // Need to mock the sessionStorage somehow
    }));

    it('should have a login method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectPOST('/session', {email: 'e@mail.com', password: 'word'})
            .respond({
                sessionId: 'test-session-d'
            })
        ;

        expect(typeof backendService.login).toBe('function');

        // Use login
        var req = backendService.login('e@mail.com', 'word');
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');

        // Should be logged in now
        expect(backendService.isLoggedIn()).toBe(true);
    }));


    it('should have a addActivityLink method', inject(function($httpBackend, backendService) {
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

        expect(typeof backendService.addActivityLink).toBe('function');

        // Add activity link
        var req = backendService.addActivityLink('Tester', { id: '1'});
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    it('should have a getMatch method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectGET('/match')
            .respond({
                team1: {
                    score: 113,
                    users: 130,
                    babies: 20,
                    captured: 27
                },
                team2: {
                    score: 85,
                    users: 105,
                    babies: 18,
                    captured: 29
                }
            })
        ;


        expect(typeof backendService.getMatch).toBe('function');

        // Get the match
        var req = backendService.getMatch();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    it('should have a getMe method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectGET('/person/me')
            .respond({
                email: 'foo@bar.baz',
                nickname: 'Alicster',
                fullName: 'Alice Alison',
                team: 'team1',
                role: 'veteran',
                id: '000000000000000000000001',
                type: 'user',
                strength: 12,
                hits: 0,
                isCaptured: false
            })
        ;

        expect(typeof backendService.getMe).toBe('function');

        // Get the match
        var req = backendService.getMe();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.success).toBe('function');
        expect(typeof req.error).toBe('function');
    }));

    // TODO: test other backend methods
});
