'use strict';

/* global describe, beforeEach, it, expect, inject, spyOn, jasmine */
describe('playerService', function() {
    var $onRootScopeSpy, backendServiceMock;

    beforeEach(module('veganaut.app.user'));

    beforeEach(module(function($provide) {
        backendServiceMock = {
            isLoggedIn: function() {
                return false;
            },
            getMe: function() {
                var promise = {
                    success: function() {
                        return promise;
                    },
                    error: function() {
                        return promise;
                    }
                };
                return promise;
            }
        };
        spyOn(backendServiceMock, 'getMe').andCallThrough();

        $onRootScopeSpy = jasmine.createSpy('$onRootScope');
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {
            $delegate.constructor.prototype.$onRootScope = $onRootScopeSpy;
            return $delegate;
        }]);

        $provide.value('backendService', backendServiceMock);
    }));

    it('should subscribe to login and logout events', inject(function(playerService) { // jshint ignore:line
        expect($onRootScopeSpy.callCount).toEqual(2);
        expect($onRootScopeSpy).toHaveBeenCalledWith('veganaut.backend.session.login', jasmine.any(Function));
        expect($onRootScopeSpy).toHaveBeenCalledWith('veganaut.backend.session.logout', jasmine.any(Function));
    }));

    it('should have a getMe method', inject(function(playerService) {
        expect(typeof playerService.getMe).toBe('function', 'getMe should be a function');
        var me = playerService.getMe();
        expect(typeof me.then).toEqual('function', 'getMe should return a promise');
    }));

    it('should request the player data on login', inject(function(playerService) { // jshint ignore:line
        // Find the login listener
        var loginListener;
        for (var i = 0; i < $onRootScopeSpy.calls.length; i++) {
            var call = $onRootScopeSpy.calls[i];
            if (call.args[0] === 'veganaut.backend.session.login') {
                loginListener = call.args[1];
                break;
            }
        }

        loginListener();
        expect(backendServiceMock.getMe).toHaveBeenCalled();
    }));

    it('should reset the player data on logout', inject(function(/*playerService*/) {
        // Find the logout listener
        // TODO: write this test again with getMe returning a promise
//        var logoutListener;
//        for (var i = 0; i < $onRootScopeSpy.calls.length; i++) {
//            var call = $onRootScopeSpy.calls[i];
//            if (call.args[0] === 'veganaut.backend.session.logout') {
//                logoutListener = call.args[1];
//                break;
//            }
//        }
//
//        var me = playerService.getMe();
//        me.test = 'this should be removed after';
//        logoutListener();
//
//        expect(me).toEqual({}, 'should empty the me object');
    }));
});
