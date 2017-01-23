'use strict';

/* global jasmine, describe, beforeEach, it, expect, inject */
describe('backendModule', function() {
    var sessionServiceMock;
    beforeEach(module('veganaut.app.backend'));

    beforeEach(module(function($provide) {
        $provide.value('backendUrl', '');
        $provide.value('alertService', {});
        $provide.value('i18nSettings', {});

        sessionServiceMock = {
            hasValidSession: jasmine.createSpy('hasValidSession'),
            createSession: jasmine.createSpy('createSession'),
            destroySession: jasmine.createSpy('destroySession')
        };

        $provide.value('sessionService', sessionServiceMock);
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

    it('should have a getMe method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectGET('/person/me')
            .respond({
                email: 'foo@bar.baz',
                nickname: 'Alicster',
                fullName: 'Alice Alison',
                id: '000000000000000000000001',
                accountType: 'player'
            })
        ;

        expect(typeof backendService.getMe).toBe('function');

        var req = backendService.getMe();
        $httpBackend.flush();

        // Make sure we got a $http object
        expect(typeof req.then).toBe('function');
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');
    }));

    it('should have a getAvailableMissions method', inject(function($httpBackend, backendService) {
        // Define our expectations
        $httpBackend.expectGET('/location/1000/availableMission/list')
            .respond({})
        ;

        expect(typeof backendService.getAvailableMissions).toBe('function');

        var req = backendService.getAvailableMissions(1000);
        $httpBackend.flush();

        // Make sure we got a promise
        expect(typeof req.then).toBe('function');
        expect(typeof req.catch).toBe('function');
        expect(typeof req.finally).toBe('function');
    }));

    // TODO: test other backend methods
});
