'use strict';

/* global describe, beforeEach, it, inject, expect, spyOn */
describe('LoginCtrl', function() {
    var $scope;
    var backendMock;

    beforeEach(module('veganaut.angularPiwik', 'veganaut.app.user'));

    beforeEach(inject(function($rootScope, $controller) {
        $scope = $rootScope.$new();
        backendMock = {
            login: function() {
                var req = {
                    then: function() {
                        return req;
                    },
                    catch: function() {
                        return req;
                    }
                };

                return req;
            },
            isLoggedIn: function() {
                return false;
            }
        };

        spyOn(backendMock, 'login').andCallThrough();

        $controller('LoginCtrl', {$scope: $scope, $translate: {}, backendService: backendMock, alertService: {}});
    }));

    it('should have a submit method that logs in', inject(function() {
        expect(typeof $scope.submit).toEqual('function');

        // Enter data in the form
        $scope.form = {
            email: 'test@example.com',
            password: '1234'
        };

        // Submit the form
        $scope.submit();
        expect(backendMock.login).toHaveBeenCalled();
        expect(backendMock.login.calls.length).toEqual(1);
        expect(backendMock.login).toHaveBeenCalledWith('test@example.com', '1234');
    }));
});
