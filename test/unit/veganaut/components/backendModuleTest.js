'use strict';

/* global jasmine, describe, beforeEach, it, expect, inject */
describe('backendModule', function() {
    var sessionServiceMock;
    beforeEach(module('veganaut.app.backend'));

    beforeEach(module(function($provide) {
        $provide.value('backendUrl', '');
        $provide.value('alertService', {});

        sessionServiceMock = {
            hasValidSession: jasmine.createSpy('hasValidSession'),
            createSession: jasmine.createSpy('createSession'),
            destroySession: jasmine.createSpy('destroySession')
        };

        $provide.value('sessionService', sessionServiceMock);

        $provide.decorator('$rootScope', function($delegate) {
            $delegate.constructor.prototype.$onRootScope = function() {};
            return $delegate;
        });
    }));

    it('should have a isLoggedIn method', inject(function($httpBackend, backendService) {
        expect(typeof backendService.isLoggedIn).toBe('function');

        backendService.isLoggedIn();
        expect(sessionServiceMock.hasValidSession.callCount).toBe(1, 'should call hasValidSession');
    }));

    it('should have a login method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectPOST('/session', {email: 'e@mail.com', password: 'word'})
            .respond({
                sessionId: 'test-session-id'
            })
        ;

        expect(typeof backendService.login).toBe('function');

        // Use login
        var req = backendService.login('e@mail.com', 'word');
        $httpBackend.flush();

        // Make sure we got a promise
        expect(typeof req.then).toBe('function');
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');

        // Should be logged in now
        expect(sessionServiceMock.createSession.callCount).toBe(1, 'should call createSession once');
        expect(sessionServiceMock.createSession).toHaveBeenCalledWith('test-session-id');
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

        // Make sure we got a promise
        expect(typeof req.then).toBe('function');
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');
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
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');
    }));

    it('should have a getMe method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectGET('/person/me')
            .respond({
                email: 'foo@bar.baz',
                nickname: 'Alicster',
                fullName: 'Alice Alison',
                team: 'team1',
                id: '000000000000000000000001',
                type: 'user',
                capture: {
                    active: false
                }
            })
        ;

        expect(typeof backendService.getMe).toBe('function');

        // Get the match
        var req = backendService.getMe();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');
    }));

    // TODO: test other backend methods
});
